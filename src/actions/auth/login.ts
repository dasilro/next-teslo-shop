'use server';;
import { signIn } from '@/auth.config';

// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {    
    await signIn('credentials', {
      redirect: false,
      ...Object.fromEntries(formData),
    });
    return 'Success';
  } catch (error) {    
    return 'CredentialsSignin';    
    //return 'UnknownError';
  }
}

export const login = async (email: string, password: string) => {
  try {
    await signIn('credentials', { email, password });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: 'Error al iniciar sesión.',
    };
    
  }
}