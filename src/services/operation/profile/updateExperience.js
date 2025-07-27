import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { UPDATE_EXPERIENCE } = profileEndpoints;

export function updateExperience(formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating Experience...");
        console.log("first", formData, "formData in updateExperience function");
        dispatch(setLoading(true));
        try {
            console.log("second")
           const response = await apiConnector("PUT", UPDATE_EXPERIENCE, formData);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Experience Updated Successfully");
            console.log(response, "UPDATE_EXPERIENCE API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Update Experience");
            console.error("Error updating experience:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
