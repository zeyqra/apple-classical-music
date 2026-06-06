const ListIcon = ({ icon: Icon, color, size, iconSize }) => {
  return (
    <div
      className={`rounded-full flex items-center justify-center`}
      style={{ backgroundColor: color, width: size, height: size }}>
      <Icon size={iconSize} color="#fff" />
    </div>
  )
}

export default ListIcon
