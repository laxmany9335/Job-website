import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { ADD_SKILLS } = profileEndpoints;

export function addSkills(formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Adding Skills...");
        console.log("first", formData, "formData in addSkills function");
        dispatch(setLoading(true));
        try {
            console.log("second")
           const response = await apiConnector("POST", ADD_SKILLS, formData);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Skills Added Successfully");
            console.log(response, "ADD_SKILLS API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Add Skills");
            console.error("Error adding skills:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
