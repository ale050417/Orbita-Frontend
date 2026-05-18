import { useRouter } from 'next/router';

export default function SeccionPage() {
  const { negocioId, moduloPadre, seccion } = useRouter().query;
  return null;
}
