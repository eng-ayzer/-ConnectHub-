import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutes = ({children , requireAuth}) => {
const {isAuthenticated , status} = useSelector((state) => state.auth)

    // show loading state while checking authentication
     if(status === "loading") {
        return(
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 max-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>

                </div>

            </div>
        )
     }
     // redirect anAuthenticated user to Sign in 
     if(requireAuth && !isAuthenticated) {
        
        return <Navigate to="/signin" replace />
     }
        
    // if routes requires unAuthenticated user (signin and signup) and user is authenticated redirect to homepage 
     if(!requireAuth && isAuthenticated) {

        return<Navigate to="/" replace/>
     }

     // otherwise let the person navigate where they at
     return children
}


export default ProtectedRoutes;