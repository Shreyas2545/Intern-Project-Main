export const DEFAULT_CONFIG_KEY = 'default'

export const PRODUCT_CONFIGS = {
  'personalize-mugs': {
    widthCm: 10,
    heightCm: 10,
    bleedCm: 0.5,
    safetyCm: 0.5,
    mockupSrc: 'https://imgs.search.brave.com/eBJKelVDKwp-ywdMnMLFVXduBMnu-UwWcweNAkZlTwo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9hcGku/dG90YWxseXByb21v/dGlvbmFsLmNvbS9E/YXRhL01lZGlhLzkx/YmUyNjkyLWIwMDEt/NDcwOC04YzMyLTk2/NTY4OWRmMTI1M1A5/MTdCLTE0LW96Li1C/YXJyZWwtQ29mZmVl/LU11Zy1CbGFuay5q/cGc',
  },
  'custom-tshirt': {
    widthCm: 50,
    heightCm: 70,
    bleedCm: 2,
    safetyCm: 4,
    mockupSrc: 'https://placehold.co/600x450/F0F8FF/333333?text=T-Shirt+Preview',
    variants: {
      default: 'https://placehold.co/600x450/F0F8FF/333333?text=T-Shirt+Preview',
      white: 'https://placehold.co/600x450/FFFFFF/333333?text=White+T-Shirt',
      black: 'https://placehold.co/600x450/000000/FFFFFF?text=Black+T-Shirt',
    },
  },
  default: {
    widthCm: 30,
    heightCm: 30,
    bleedCm: 1,
    safetyCm: 1,
    mockupSrc: null,
  },
}