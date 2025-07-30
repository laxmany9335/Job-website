import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { GET_EXPERIENCE } = profileEndpoints;

export function getExperience(token) {
    return async (dispatch) => {
        const toastId = toast.loading("Fetching Experience...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("GET", GET_EXPERIENCE,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Experience Fetched Successfully");
            console.log(response, "GET_EXPERIENCE API RESPONSE............");
            return response;
        } catch (error) {
            toast.error(error.message || "Failed to Fetch Education");
            console.error("Error fetching education:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
