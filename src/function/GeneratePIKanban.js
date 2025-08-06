export class GeneratePIKanban {
  constructor(PiKanbanQR) {
    this.PiKanbanQR = PiKanbanQR;
  }

  getFixedCode() {
    let fixCode = this.PiKanbanQR.substring(0, 65);
    return fixCode;
  }

  getCustomerPartNo() {
    let customerPartNo = this.PiKanbanQR.substring(66, 90).trim();
    return customerPartNo;
  }

  getDensoPartNo() {
    let densoPartNo = this.PiKanbanQR.substring(91, 105).trim();
    return densoPartNo;
  }

  getQtyPerKanban() {
    let qtyPerKanban = this.PiKanbanQR.substring(106, 112);
    let newQty = '';
    for (let index = 0; index < qtyPerKanban.length; index++) {
      if (qtyPerKanban.charAt(index) !== 0) {
        newQty += qtyPerKanban.charAt(index);
      }
    }

    return parseInt(newQty);
  }

  getProcessCode() {
    let processCode = this.PiKanbanQR.substring(113, 117);
    return processCode;
  }

  getSeqNumber() {
    let seqNumber = this.PiKanbanQR.substring(118, 125);
    let newSeqNumber = '';
    for (let index = 0; index < seqNumber.length; index++) {
      if (seqNumber.charAt(index) !== 0) {
        newSeqNumber += seqNumber.charAt(index);
      }
    }
    return parseInt(newSeqNumber);
  }
}
