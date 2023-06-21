
import UserProfileForm from '@/components/UserProfileForm';
import { getBackendData } from '../back_api';

export default async function ForgotPassword() {
  const personalDetails: UserRead = await getBackendData("get", "api/v1/users/me");
  return (
    <main>
      <UserProfileForm params={{
        email: personalDetails.email
      }} ></UserProfileForm>
    </main>
  )
}