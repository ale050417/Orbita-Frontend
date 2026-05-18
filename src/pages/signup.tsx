import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: { destination: '/onboarding/rubro', permanent: false },
});

export default function SignupPage() {
  return null;
}
