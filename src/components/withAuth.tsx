import { useRouter } from "next/navigation";
import { useEffect, ComponentType } from "react";

// Define a type for props which is generic
type WithAuthProps = {};

// Modify withAuth to accept a component of type ComponentType
const withAuth = <P extends object>(Component: ComponentType<P>) => {
  const AuthComponent = (props: P & WithAuthProps) => {
    const router = useRouter();

    useEffect(() => {
      const username = localStorage.getItem("username");
      if (!username) {
        router.push("/login");
      }
    }, [router]);

    return <Component {...props} />;
  };

  // Set display name for debugging purposes
  AuthComponent.displayName = `WithAuth(${
    Component.displayName || Component.name || "Component"
  })`;

  return AuthComponent;
};

export default withAuth;
