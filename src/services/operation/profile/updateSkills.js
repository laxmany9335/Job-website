import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { UPDATE_SKILLS } = profileEndpoints;

export function updateSkills(formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating Skills...");
        console.log("first", formData, "formData in updateSkills function");
        dispatch(setLoading(true));
        try {
            console.log("second")
           const response = await apiConnector("PUT", UPDATE_SKILLS, formData);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Skills Updated Successfully");
            console.log(response, "UPDATE_SKILLS API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Update Skills");
            console.error("Error updating skills:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
