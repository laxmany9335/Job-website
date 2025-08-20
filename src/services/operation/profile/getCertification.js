import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { GET_CERTIFICATION } = profileEndpoints;

export function getCertification(formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Fetching Certification...");
        console.log("first", formData, "formData in Certification function");
        dispatch(setLoading(true));
        try {
            console.log("second")
           const response = await apiConnector("GET", GET_CERTIFICATION, formData);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Certification Fetched Successfully");
            console.log(response, "GET_CERTIFICATION API RESPONSE............");
            return response;
        } catch (error) {
            toast.error(error.message || "Failed to Fetch Certification");
            console.error("Error fetching Certification:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
