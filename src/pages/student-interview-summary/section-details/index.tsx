import "./index.less"
const SectionDetails = ({className, title, children}) => {
  return (
    <>
     <div className={`${className} con-box`}>
          <h2 className={"secondary-title"}>{title}</h2>
          <div className={"con-box-wrap"}>
            {children}
          </div>
     </div>

    </>
  )
}

export default SectionDetails
