export const formatDueDate = (dueDate) => {
    const date = new Date(dueDate);
    const options = { weekday: "long", hour: "numeric", minute: "numeric" };
    return date.toLocaleString("en-US", options);
  };