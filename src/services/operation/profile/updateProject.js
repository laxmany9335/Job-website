import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { UPDATE_PROJECT } = profileEndpoints;

export function updateProject(projectData, projectId) {
    return async (dispatch) => {
       console.log(projectData, projectId)
        const toastId = toast.loading("Update Project...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("PATCH",
                `${UPDATE_PROJECT}/${projectId}`,
                projectData
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Project Update Successfully");
            console.log(response, "UPDATE_PROJECT API RESPONSE............");
            return response;
        } catch (error) {
            toast.error(error.message || "Failed to Update Project");
            console.error("Error Update Project:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
