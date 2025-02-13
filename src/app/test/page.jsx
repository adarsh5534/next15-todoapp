'use client';
import CustomPagination from '@/components/CustomPagination';
import React, { useState } from 'react';

const Page = () =>
{
  const { state, dispatch } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(state?.task_list?.totalPages / 5); // Replace with your actual total pages
  console.log(state?.task_list?.pagination?.totalPages ,'sdddddddd')
  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          maxVisible={5}
          onPageChange={setCurrentPage}
        />
      </div>
      
      {/* Your page content here */}
      <div className="text-center">
        Current Page: {currentPage}
      </div>
    </main>
  );
};

export default Page;