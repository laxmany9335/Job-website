import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { GET_ACHIEVEMENT } = profileEndpoints;

export function getAchievement(formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Fetching Achievements...");
        console.log("first", formData, "formData in getAchievements function");
        dispatch(setLoading(true));
        try {
            console.log("second")
           const response = await apiConnector("GET", GET_ACHIEVEMENT, formData);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Achievements Fetched Successfully");
            console.log(response, "GET_ACHIEVEMENTS API RESPONSE............");
            return response;
        } catch (error) {
            toast.error(error.message || "Failed to Fetch Achievements");
            console.error("Error fetching achievements:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
