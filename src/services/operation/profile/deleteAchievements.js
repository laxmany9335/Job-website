import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { DELETE_ACHIEVEMENT } = profileEndpoints;

export function deleteAchievement(achievementId) {
    return async (dispatch) => {
         const toastId = toast.loading("Deleting Achievements...");
    
        dispatch(setLoading(true));
        try {
           const response = await apiConnector("DELETE", DELETE_ACHIEVEMENT, { achievementId });

            
            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Achievements Deleted Successfully");
            console.log(response, "DELETE_ACHIEVEMENTS API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Delete Achievements");
            console.error("Error deleting achievements:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
