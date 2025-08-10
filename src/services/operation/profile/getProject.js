import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { GET_PROJECTS } = profileEndpoints;

export function getProject(token) {
    return async (dispatch) => {
        const toastId = toast.loading("Fetching Project...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("GET", GET_PROJECTS,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Project Fetched Successfully");
            console.log(response, "GET_PROJECTS API RESPONSE............");
            return response;
        } catch (error) {
            toast.error(error.message || "Failed to Fetch get Project");
            console.error("Error fetching Project:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
