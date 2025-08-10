import toast from 'react-hot-toast';
import { apiConnector } from '../../apiConnector';
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis';

const { UPDATE_EXPERIENCE } = profileEndpoints;

export function updateExperience(experienceData, experienceId) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating Experience...");
    dispatch(setLoading(true));

    try {
      console.log("Updating experience with data:", experienceData, experienceId);

      const response = await apiConnector(
        "PATCH",
        `${UPDATE_EXPERIENCE}/${experienceId}`,
        experienceData // ✅ Send experienceData instead of experienceId
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unknown error");
      }

      toast.success("Experience Updated Successfully");
      console.log("UPDATE_EXPERIENCE API RESPONSE:", response);
      return response.data.success;
    } catch (error) {
      console.error("Error updating experience:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to update experience");
      return false;
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}
