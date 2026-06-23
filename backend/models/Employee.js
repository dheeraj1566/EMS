const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    employeeCode: {
      type: String,
      required: true,
      unique: true,
    },

    appPassword: String,

    employmentType: String,

    country: String,
    state: String,
    district: String,
    branch: String,
    area: String,

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },

    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
    },

    fileNo: String,
    designation: String,

    dateOfJoining: Date,
    bioDataSubmissionDate: Date,

    personalDetails: {
      salutation: String,

      firstName: String,
      middleName: String,
      lastName: String,

      fatherName: String,
      motherName: String,

      spouseName: String,

      gender: String,
      maritalStatus: String,

      dob: Date,

      dobState: String,
      dobDistrict: String,

      birthPlace: String,

      mobileSelf: String,
      mobileHome: String,

      nationality: String,
      otherNationality: String,

      foreignAddress: String,

      category: String,

      employeeType: {
        type: String,
        enum: ["Civilian", "Ex-Man"],
      },

      isGunman: Boolean,

      familyMembers: [
        {
          name: String,
          relation: String,
          dob: Date,
          age: Number,
          qualification: String,
          aadharNo: String,
          mobileNo: String,
          isNominee: Boolean,
          nomineeShare: Number,
        },
      ],
    },

    communication: {
      presentAddress: {
        houseNo: String,
        block: String,
        sector: String,
        colony: String,
        near: String,
        pinCode: String,
        phone: String,
        mobile: String,
        homeMobile: String,
        email: String,
        policeStation: String,
        state: String,
        district: String,
      },

      permanentAddress: {
        village: String,
        post: String,
        policeStation: String,
        tehsil: String,
        district: String,
        state: String,
        pinCode: String,
        telegraphOffice: String,
        phone: String,
        mobile: String,
      },
    },

    kyc: {
      aadharNo: String,
      panNo: String,
      voterId: String,

      issueDate: Date,

      uanNo: String,
      pfNo: String,

      esicNo: String,
      oldEsicNo: String,

      wcPolicyNo: String,

      expiryDate: Date,
      validDate: Date,

      amount: Number,

      idCardNo: String,

      notaryStampPadNo: String,
    },

    bankDetails: {
      accountNo: String,
      ifscCode: String,
      bankName: String,
      branchName: String,
      accountHolderName: String,
    },

    education: {
      highestEducation: String,
      instituteName: String,

      professionalQualification: String,
      professionalInstitute: String,

      percentage: Number,

      additionalQualification: String,

      grade: String,
    },

    compliance: {
      pfMembership: Boolean,

      pfChallan: String,

      esicChallan: String,

      replacementEmployee: Boolean,

      replacementFileNo: String,

      reason: String,
    },

    documents: {
      photo: String,
      signature: String,

      aadharFront: String,
      aadharBack: String,

      panCard: String,

      passbook: String,

      certificate: String,

      drivingLicense: String,
    },

    physicalDetails: {
      bloodGroup: String,

      shoeSize: String,
      waist: String,
      height: String,

      weight: String,
      chest: String,

      tshirtSize: String,
      trouserSize: String,

      careerAspirations: String,
    },

    policeVerification: {
      verificationNo: String,

      verificationDate: Date,

      criminology: String,

      pvSendDate: Date,

      pvReturnDate: Date,

      policeStationName: String,

      identitySign: String,

      validUpto: Date,

      remarkByThana: String,

      document: String,
    },

    exService: {
      serviceNo: String,

      rank: String,

      armsCorps: String,

      yearsOfService: Number,

      cardNo: String,

      dateOfDischarge: Date,

      category: String,

      characterAssessment: String,

      document: String,
    },

    gunman: {
      licenseNo: String,

      gunNo: String,

      armType: String,

      validArea: String,

      licenseExpiry: Date,

      inspectionProductionDate: Date,

      isExServiceGunman: Boolean,

      document: String,
    },

    training: [
      {
        startDate: Date,
        endDate: Date,

        totalDays: Number,

        trainingCertificateNo: String,

        trainingCertificateDate: Date,

        certificateIssued: Boolean,

        result: String,

        remarks: String,

        trainingUndergone: String,

        institute: String,

        location: String,

        document: String,
      },
    ],

    medical: [
      {
        medicalDate: Date,

        doctorName: String,

        doctorQualification: String,

        hospital: String,

        doctorDesignation: String,

        registrationNo: String,

        doctorAddress: String,

        phoneNo: String,

        eyeCondition: String,

        medicalCertificateIssued: Boolean,

        medicalCertificateDate: Date,

        comments: String,

        document: String,
      },
    ],

    currentStatus: {
      type: String,
      enum: ["Active", "Left", "Terminated", "Rejoined"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
