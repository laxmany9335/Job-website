import toast from 'react-hot-toast';
import { apiConnector } from '../../apiConnector';
import { setLoading } from '../../../slice/authSlice';
import { profileEndpoints } from '../../apis';

const { UPDATE_CERTIFICATION } = profileEndpoints;

export function updateCertification(certificationData, certificationId) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating certification...");
        console.log("Updating certification:", certificationId);

        dispatch(setLoading(true));

        try {
            const response = await apiConnector(
                "PATCH",
                `${UPDATE_CERTIFICATION}/${certificationId}`,
                certificationData
            );

            if (!response.data?.success) {
                throw new Error(response.data?.message || "Unknown error");
            }

            toast.success("certification Updated Successfully");
            console.log("UPDATE_CERTIFICATION API RESPONSE:", response.data);
            return true;
        } catch (error) {
            toast.error(error?.message || "Failed to Update certification");
            console.error("Error updating certification:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}