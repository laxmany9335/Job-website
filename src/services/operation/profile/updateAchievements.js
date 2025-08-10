import toast from 'react-hot-toast';
import { apiConnector } from '../../apiConnector';
import { setLoading } from '../../../slice/authSlice';
import { profileEndpoints } from '../../apis';

const { UPDATE_ACHIEVEMENT } = profileEndpoints;

export function updateAchievement(achievementsData, achievementsId) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating Achievement...");
        console.log("Updating Achievement:", achievementsId);

        dispatch(setLoading(true));

        try {
            const response = await apiConnector(
                "PATCH",
                `${UPDATE_ACHIEVEMENT}/${achievementsId}`,
                achievementsData
            );

            if (!response.data?.success) {
                throw new Error(response.data?.message || "Unknown error");
            }

            toast.success("Achievement Updated Successfully");
            console.log("UPDATE_ACHIEVEMENT API RESPONSE:", response.data);
            return true;
        } catch (error) {
            toast.error(error?.message || "Failed to Update Achievement");
            console.error("Error updating achievement:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
