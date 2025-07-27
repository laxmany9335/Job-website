import toast from 'react-hot-toast'
import { apiConnector } from '../../apiConnector'
import { setLoading } from "../../../slice/authSlice";
import { profileEndpoints } from '../../apis'
const { ADD_PROJECT } = profileEndpoints;

export function addProject(formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Adding Project...");
        console.log("first", formData, "formData in addProject function");
        dispatch(setLoading(true));
        try {
            console.log("second")
           const response = await apiConnector("POST", ADD_PROJECT, formData);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Project Added Successfully");
            console.log(response, "ADD_PROJECT API RESPONSE............");
            return response.data.success;
        } catch (error) {
            toast.error(error.message || "Failed to Add Project");
            console.error("Error adding project:", error);
            return false;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}
