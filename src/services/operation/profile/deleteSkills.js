import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { DELETE_SKILLS } = profileEndpoints;

export function deleteSkills(formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Deleting Skills...");
        console.log("first", formData, "formData in deleteSkills function");
        dispatch(setLoading(true));
        try {
            console.log("second")
           const response = await apiConnector("POST", DELETE_SKILLS, formData);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Skills Deleted Successfully");
            console.log(response, "DELETE_SKILLS API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Delete Skills");
            console.error("Error deleting skills:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
