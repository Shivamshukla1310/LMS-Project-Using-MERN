import { useParams, Navigate } from "react-router-dom";
import { useGetCourseDetailWithStatusQuery } from "features/apis/purchaseApi";

const PurchaseCourseProtectedRoute = ({ children }) => {
  const { courseId } = useParams();
  const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <Navigate to={`/course-detail/${courseId}`} replace />;

  // Assuming your API response has a boolean `purchased` flag
  return data?.purchased ? children : <Navigate to={`/course-detail/${courseId}`} replace />;
};

export default PurchaseCourseProtectedRoute;
