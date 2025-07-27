import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { GET_SKILLS } = profileEndpoints;

export function getSkills(formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Fetching Skills...");
        console.log("first", formData, "formData in getSkills function");
        dispatch(setLoading(true));
        try {
            console.log("second")
           const response = await apiConnector("GET", GET_SKILLS, formData);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Skills Fetched Successfully");
            console.log(response, "GET_SKILLS API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Fetch Skills");
            console.error("Error fetching skills:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
