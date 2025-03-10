export const AuthFlowEnum = {
  SignIn: 'signIn',
  SignUp: 'signUp',
} as const

export type AuthFlowType = (typeof AuthFlowEnum)[keyof typeof AuthFlowEnum]

export const AuthProviderEnum = {
  Google: 'google',
  Github: 'github',
} as const

export type AuthProviderType =
  (typeof AuthProviderEnum)[keyof typeof AuthProviderEnum]
