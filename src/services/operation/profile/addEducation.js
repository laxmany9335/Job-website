import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { ADD_EDUCATION } = profileEndpoints;

export function addEducation(formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Adding Education...");
        console.log("first", formData, "formData in addEducation function");
        dispatch(setLoading(true));
        try {
            console.log("second")
           const response = await apiConnector("POST", ADD_EDUCATION, formData);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Education Added Successfully");
            console.log(response, "ADD_EDUCATION API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Add Education");
            console.error("Error adding education:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
