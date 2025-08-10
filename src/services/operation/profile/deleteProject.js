import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { DELETE_PROJECT } = profileEndpoints;

export function deleteProject(projectId) {
    console.log(projectId)
    return async (dispatch) => {
        const toastId = toast.loading("Delete Project...");
        dispatch(setLoading(true));
        try {
                const response = await apiConnector("DELETE", DELETE_PROJECT, { projectId });
            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Project Delete Successfully");
            console.log(response, "DELETE_PROJECT API RESPONSE............");
            return response;
        } catch (error) {
            toast.error(error.message || "Failed to Delete Project");
            console.error("Error Delete Project:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
