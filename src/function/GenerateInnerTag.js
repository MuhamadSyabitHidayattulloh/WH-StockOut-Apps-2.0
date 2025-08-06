export class GenerateInnerTage {
  constructor(innerTage) {
    this.innerTage = innerTage;
  }

  getDate() {
    let fixCode = this.innerTage.substring(0, 80);
    return fixCode;
  }

  getFirstCustumerPartNumber() {
    let custPartNumber = this.innerTage.substring(81, 96);
    return custPartNumber;
  }

  getSecondCustumerPartNumber() {
    let custPartNumber = this.innerTage.substring(97, 114);
    return custPartNumber;
  }

  getProcessCode() {
    let processCode = this.innerTage.substring(115, 124);
    return processCode;
  }

  getProcessDate() {
    let processDate = this.innerTage.substring(125, 133);
    return processDate;
  }

  getQtyPerKanban() {
    let qtyPerKanban = this.innerTage.substring(134, 140);

    let newQty = '';
    for (let index = 0; index < qtyPerKanban.length; index++) {
      if (qtyPerKanban.charAt(index) !== 0) {
        newQty += qtyPerKanban.charAt(index);
      }
    }
    return parseInt(newQty);
  }

  getSeqInnerTag() {
    let sequence = this.innerTage.substring(141, 147);

    let newSeq = '';
    for (let index = 0; index < sequence.length; index++) {
      if (sequence.charAt(index) !== 0) {
        newSeq += sequence.charAt(index);
      }
    }
    return parseInt(newSeq);
  }

  getPartNumber() {
    let partNumber = this.innerTage.substring(161, 178).trim();
    return partNumber;
  }
}
