import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { UPDATE_EDUCATION } = profileEndpoints;

export function updateEducation(educationData, educationId) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating education...");
    dispatch(setLoading(true));

    try {
      console.log("Updating education with data:", educationData, educationId);

      const response = await apiConnector(
        "PATCH",
        `${UPDATE_EDUCATION}/${educationId}`,
        educationData
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unknown error");
      }

      toast.success("Education Updated Successfully");
      console.log("UPDATE_EDUCATION API RESPONSE:", response);
      return response.data.success;
    } catch (error) {
      console.error("Error updating Education:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to update Education");
      return false;
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}
