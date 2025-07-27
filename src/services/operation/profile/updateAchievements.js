import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { UPDATE_ACHIEVEMENTS } = profileEndpoints;

export function updateAchievements(formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating Achievements...");
        console.log("first", formData, "formData in updateAchievements function");
        dispatch(setLoading(true));
        try {
            console.log("second")
           const response = await apiConnector("PUT", UPDATE_ACHIEVEMENTS, formData);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Achievements Updated Successfully");
            console.log(response, "UPDATE_ACHIEVEMENTS API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Update Achievements");
            console.error("Error updating achievements:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
