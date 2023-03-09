import { IUserHunter, IUserProvisioner } from "./types"

type TReturnValue = {
  isNationalId: boolean
  errorMessage: string | ""
}

const IsNationalId = (content: string, input: IUserHunter | IUserProvisioner, type: "hunter" | "provisioner") => {

  const returnValue: TReturnValue = {
    isNationalId: false,
    errorMessage: "",
  }

  if (type === "hunter") {
    const this_input = input as IUserHunter
    const conditions = {
      full_name: {
        first: content.toLowerCase().includes(this_input.full_name.first.toLowerCase()),
        last: content.toLowerCase().includes(this_input.full_name.last.toLowerCase()),
      },
      keywords: {
        "republika ng pilipinas": content.toLowerCase().includes("republika ng pilipinas"),
        "republic of the philippines": content.toLowerCase().includes("republic of the philippines"),
        "philippine identification card": content.toLowerCase().includes("philippine identification card"),
        "pambansang pagkakakilanlan": content.toLowerCase().includes("pambansang pagkakakilanlan"),
      },
      id_number: content.toLowerCase().includes(this_input.id_number.toLowerCase()),
    }
    
    console.log(conditions)
    
    // check if national id is valid
    const isNationalId = conditions.full_name.first
      && conditions.full_name.last
      && conditions.keywords["republika ng pilipinas"]
      && conditions.keywords["republic of the philippines"]
      && conditions.keywords["philippine identification card"]
      && conditions.keywords["pambansang pagkakakilanlan"]
      && conditions.id_number


    returnValue.isNationalId = isNationalId
    returnValue.errorMessage = conditions.full_name.first ? "" : "First name is not valid"
    returnValue.errorMessage = conditions.full_name.last ? "" : "Last name is not valid"
    returnValue.errorMessage = conditions.keywords["republika ng pilipinas"] ? "" : "National ID is not valid"
    returnValue.errorMessage = conditions.keywords["republic of the philippines"] ? "" : "National ID is not valid"
    returnValue.errorMessage = conditions.keywords["philippine identification card"] ? "" : "National ID is not valid"
    returnValue.errorMessage = conditions.keywords["pambansang pagkakakilanlan"] ? "" : "National ID is not valid"
    returnValue.errorMessage = conditions.id_number ? "" : "ID number is not valid"
    return returnValue
  }

  if (type === "provisioner") {
    // national id is not required for provisioners
    returnValue.isNationalId = false;
    returnValue.errorMessage = "National ID is not required for provisioners"
    return returnValue
  }
}

export {
  IsNationalId,
}