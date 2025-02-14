import { NextResponse } from "next/server";
import dbConnect from "../../../../utils/dbConnect";
import Todos from "../../../../models/Todos";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../utils/authOptions";

// Constants for better maintainability
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;
const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized access",
  MISSING_ID: "User ID is required",
  SERVER_ERROR: "Internal server error occurred",
};

// Helper function to parse pagination params
const getPaginationParams = (searchParams) => {
  const page = Math.max(
    parseInt(searchParams.get("page") || DEFAULT_PAGE, 10),
    DEFAULT_PAGE
  );
  const limit = Math.max(
    parseInt(searchParams.get("limit") || DEFAULT_LIMIT, 10),
    1
  );
  return { page, limit, skip: (page - 1) * limit };
};

// Helper function to build query
const buildQuery = (userId, category) => {
  const query = { userId };
  if (category) query.category = category;
  return query;
};

export async function GET(req) {
  try {
    // Connect to DB and verify session
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    // Get and validate URL params
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    
    if (!userId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.MISSING_ID },
        { status: 400 }
      );
    }

    // Get pagination params and build query
    const { page, limit, skip } = getPaginationParams(searchParams);
    const query = buildQuery(userId, searchParams.get("cat"));

    // Execute DB queries in parallel
    const [userTasks, totalCount] = await Promise.all([
      Todos.find(query)
        .select('-__v')  
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      Todos.countDocuments(query)
    ]);

    // Return paginated response
    return NextResponse.json(
      {
        success: true,
        data: userTasks,
        pagination: {
          total: totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          limit,
        },
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Change to specific frontend URL in production
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );

  } catch (error) {
    console.error("Error in GET /todos:", error);
    return NextResponse.json(
        { error: "Something went wrong, please try again later" },
        { status: 500 }
    );
  }
}