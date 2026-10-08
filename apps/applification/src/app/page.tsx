import { BusinessHomepage } from "@/components/business/business-homepage";
import { ProfileHomepage } from "@/components/home/profile-homepage";
import { StructuredData } from "@/components/structured-data";
import {
  businessStructuredData,
  profileStructuredData,
} from "@/lib/site-structured-data";
import { getSiteIdentity } from "@/lib/site-identity.server";
import { isContactWorkflowAvailable } from "@/lib/contact";

export const metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  const site = await getSiteIdentity();
  return (
    <>
      <StructuredData
        data={
          site === "profile" ? profileStructuredData : businessStructuredData
        }
      />
      {site === "profile" ? (
        <ProfileHomepage contactAvailable={isContactWorkflowAvailable()} />
      ) : (
        <BusinessHomepage contactAvailable={isContactWorkflowAvailable()} />
      )}
    </>
  );
}
