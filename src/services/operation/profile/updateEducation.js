import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { UPDATE_EDUCATION } = profileEndpoints;

export function updateEducation(formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating Education...");
        console.log("first", formData, "formData in updateEducation function");
        dispatch(setLoading(true));
        try {
            console.log("second")
           const response = await apiConnector("PUT", UPDATE_EDUCATION, formData);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Education Updated Successfully");
            console.log(response, "UPDATE_EDUCATION API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Update Education");
            console.error("Error updating education:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
