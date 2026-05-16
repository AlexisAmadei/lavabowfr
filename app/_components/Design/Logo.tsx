import logo from '@/assets/icons/logo.svg'

export default function Logo({ h, w }: { h?: string; w?: string }) {
  return (
    <>
      <img className='lvb-logo' src={logo.src} alt="Logo" height={h} width={w} title="Logo" />
    </>
  )
}
