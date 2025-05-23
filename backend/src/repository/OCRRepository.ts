import { dataModel } from "../model/dataModel";
export type TData = {
  aadhaarNumber:string,
  name:string,
  dob:string,
  gender:string,
  address:string
};
export class OCRRepository {
  async saveData(data:TData): Promise<void> {
    await dataModel.create({
      aadhaarNumber: data.aadhaarNumber,
      name:data.name,
      dob:data.dob,
      gender:data.gender,
      address:data.address
    });
  }
}