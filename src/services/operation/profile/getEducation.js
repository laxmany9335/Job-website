import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { GET_EDUCATION } = profileEndpoints;

export function getEducation(token) {
    return async (dispatch) => {
        const toastId = toast.loading("Fetching Education...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("GET", GET_EDUCATION,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Education Fetched Successfully");
            console.log(response, "GET_EDUCATION API RESPONSE............");
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
