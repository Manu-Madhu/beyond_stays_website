export interface ButtonProps {
    title: string,
    link: string,
    className?: string,
    children?: React.ReactNode
}

export interface HeaderProps {
    title: string,
    description?: string,
    children?: React.ReactNode,
    className?: string
}
export interface BannerProps {
    title?: string,
    banner: string,
    subtitle?: string[],
}