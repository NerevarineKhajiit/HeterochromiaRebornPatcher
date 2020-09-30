//SCOPE OF THE PATCHER:
//First: Identify Eye Texture Sets available and copy them into the patcher to eliminate needing master .esp files and prevent them being overwritten by other mods
// ~~ Settings optionally allow for excluding Vanilla textures in this step
//Second: Create some Special Head Parts per texture set to create Left and Right eye records for each valid race
// ~~ Valid Races include AllRacesMinusBeast, Khajiit, and Argonian.
// ~~ Despite having different meshes, Khajiit and Argonian textures are cross-compatible
//Third: Load all existing HDPT records, and filter it down to playable eyes that didn't come from the patcher
// ~~ Settings optionally allow for including or excluding Vanilla and/or Modded eyes per the user's whim
//Fourth: Set all filtered eyes to unplayable so they don't appear in the eye slider at character creation.
// ~~ Any eyes removed this way necessitate the patch being dependent on the .esp/.esm the eyes came from
// ~~ This is to prevent overlapping eyes showing simultaneously in the character model. Has the side-effect of making CharGen load with no eyes in the character at first.

// Note to those running this patcher:
// Due to how Skyrim handles Texture sets, there's no inherent way to look at a Texture Set's record and determine if it's intended for Eyes beyond just reading the names.
// So, I have to check the ID name of the TXST, the filepath to the texture, and the filename of the texture itself for any indication that it's for Eyes.
// This means only mods that include the word "Eye" somewhere in one of those three places will actually get patched.
// Furthermore, I also have to check those 3 places for indication as to if the eyes are intended for Beast Races or not.
// I have the patcher make the assumption that an absence of "Khajiit" or "Argonian" means it's not for Beasts.
// So, if the mod doesn't include a fully written-out racial name for Argonian and Khajiit eyes, the patcher will end up placing unusable Beast Race eyes in the Human/Elven sliders.
// Double-check your chose eye mod(s)' Texture Sets records in zEdit to make sure the "EDID" value or "TX00 - Diffuse" value have the requried words somewhere in them.
// If they don't, you'll either need to manually re-name the TXSTs to include the right words, or if they're consistent enough in their naming, edit this patcher to catch them.

// ~~~ Begin Code ~~~

// ~~~ Begin Variable Declaration ~~~

// Declare some global variables containing the path to the Mesh files.
// You can change these to point to non-vanilla meshes if you want, but be careful to make sure the meshes actually work with the Texture sets you'll be running the patcher against.
// Note that the custom Beast meshes provided by expired6978 are just in "character assets", whereas the vanilla Man/Mer meshes are in "character assets\FaceParts"
// Argonian Left Eye (Unisex)
let argLeftEyeNIFPath = 'meshes\\actors\\character\\character assets\\eyesargonianleft.nif'; //The file and folder path to the NIF mesh file
let argLeftEyeTRIPath = 'meshes\\actors\\character\\character assets\\eyesargonianleft.tri'; //The file and folder path to the TRI mesh file
let argLeftEyeCHARGENPath = 'meshes\\actors\\character\\character assets\\eyesargonianleftchargen.tri'; //The file and folder path to the CHARGEN TRI file
// Argonian Right Eye (Unisex)
let argRightEyeNIFPath = 'meshes\\actors\\character\\character assets\\eyesargonianright.nif'; //The file and folder path to the NIF mesh file
let argRightEyeTRIPath = 'meshes\\actors\\character\\character assets\\eyesargonianright.tri'; //The file and folder path to the TRI mesh file
let argRightEyeCHARGENPath = 'meshes\\actors\\character\\character assets\\eyesargonianrightchargen.tri'; //The file and folder path to the CHARGEN TRI file
// Khajiit Female Left Eye
let khajFemLeftEyeNIFPath = 'meshes\\actors\\character\\character assets\\eyeskhajiitfemaleleft.nif'; //The file and folder path to the NIF mesh file
let khajFemLeftEyeTRIPath = 'meshes\\actors\\character\\character assets\\eyeskhajiitfemaleleft.tri'; //The file and folder path to the TRI mesh file
let khajFemLeftEyeCHARGENPath = 'meshes\\actors\\character\\character assets\\eyeskhajiitfemaleleftchargen.tri'; //The file and folder path to the CHARGEN TRI file
// Khajiit Female Right Eye
let khajFemRightEyeNIFPath = 'meshes\\actors\\character\\character assets\\eyeskhajiitfemaleright.nif'; //The file and folder path to the NIF mesh file
let khajFemRightEyeTRIPath = 'meshes\\actors\\character\\character assets\\eyeskhajiitfemaleright.tri'; //The file and folder path to the TRI mesh file
let khajFemRightEyeCHARGENPath = 'meshes\\actors\\character\\character assets\\eyeskhajiitfemalerightchargen.tri'; //The file and folder path to the CHARGEN TRI file
// Khajiit Male Left Eye
let khajMaleLeftEyeNIFPath = 'meshes\\actors\\character\\character assets\\eyeskhajiitleft.nif'; //The file and folder path to the NIF mesh file
let khajMaleLeftEyeTRIPath = 'meshes\\actors\\character\\character assets\\eyeskhajiitleft.tri'; //The file and folder path to the TRI mesh file
let khajMaleLeftEyeCHARGENPath = 'meshes\\actors\\character\\character assets\\eyeskhajiitleftchargen.tri'; //The file and folder path to the CHARGEN TRI file
// Khajiit Male Right Eye
let khajMaleRightEyeNIFPath = 'meshes\\actors\\character\\character assets\\eyeskhajiitright.nif'; //The file and folder path to the NIF mesh file
let khajMaleRightEyeTRIPath = 'meshes\\actors\\character\\character assets\\eyeskhajiitright.tri'; //The file and folder path to the TRI mesh file
let khajMaleRightEyeCHARGENPath = 'meshes\\actors\\character\\character assets\\eyeskhajiitrightchargen.tri'; //The file and folder path to the CHARGEN TRI file
// AllRacesMinusBeast Female Left Eye
let armbFemLeftEyeNIFPath = 'meshes\\actors\\character\\character assets\\FaceParts\\EyeFemaleLeft.nif'; //The file and folder path to the NIF mesh file
let armbFemLeftEyeTRIPath = 'meshes\\actors\\character\\character assets\\FaceParts\\EyesFemaleLeft.tri'; //The file and folder path to the TRI mesh file
let armbFemLeftEyeCHARGENPath = 'meshes\\actors\\character\\character assets\\FaceParts\\EyesFemaleLeftChargen.tri'; //The file and folder path to the CHARGEN TRI file
// AllRacesMinusBeast Female Right Eye
let armbFemRightEyeNIFPath = 'meshes\\actors\\character\\character assets\\FaceParts\\EyeFemaleRight.nif'; //The file and folder path to the NIF mesh file
let armbFemRightEyeTRIPath = 'meshes\\actors\\character\\character assets\\FaceParts\\EyesFemaleRight.tri'; //The file and folder path to the TRI mesh file
let armbFemRightEyeCHARGENPath = 'meshes\\actors\\character\\character assets\\FaceParts\\EyesFemaleRightChargen.tri'; //The file and folder path to the CHARGEN TRI file
// AllRacesMinusBeast Male Left Eye
let armbMaleLeftEyeNIFPath = 'meshes\\actors\\character\\character assets\\FaceParts\\EyesMaleLeft.nif'; //The file and folder path to the NIF mesh file
let armbMaleLeftEyeTRIPath = 'meshes\\actors\\character\\character assets\\FaceParts\\EyesMaleLeft.tri'; //The file and folder path to the TRI mesh file
let armbMaleLeftEyeCHARGENPath = 'meshes\\actors\\character\\character assets\\FaceParts\\EyesMaleLeftChargen.tri'; //The file and folder path to the CHARGEN TRI file
// AllRacesMinusBeast Male Right Eye
let armbMaleRightEyeNIFPath = 'meshes\\actors\\character\\character assets\\FaceParts\\EyesMaleRight.nif'; //The file and folder path to the NIF mesh file
let armbMaleRightEyeTRIPath = 'meshes\\actors\\character\\character assets\\FaceParts\\EyesMaleRight.tri'; //The file and folder path to the TRI mesh file
let armbMaleRightEyeCHARGENPath = 'meshes\\actors\\character\\character assets\\FaceParts\\EyesMaleRightChargen.tri'; //The file and folder path to the CHARGEN TRI file

// ~~~ End Variable Declaration

// ~~~ Begin Functions to call during the patch process ~~~

// This function will be passed a string and return a Race category based on the contents of the String
let raceIdentificationParser = function(string) {
  // Re-assign the string variable to a new value for easier parsing
  string = string.toLowerCase(); //Convert the string to lowercase to remove the need for case-sensitive checks
  // Use if/else statements to check the string
  if (string.includes('argonian')){ //check if the string includes Argonian
    return "BeastRace"; //if it does, return Beast Race
  } else if (string.includes('khajiit')){ //check if the string includes Khajiit
    return "BeastRace"; //if it does, return Beast Race
  } else if (string.includes('khajit')){ //check if the string includes Khajit(sic), since some mods like Innova889's Runic Eyes use this misspelling
    return "BeastRace"; //if it does, return Beast Race
  } else if (string.includes('fablook')){ //check if the string includes FabLook to allow textures from that mod to pass through properly
    return "BeastRace"; //if it does, return Beast Race
  } else if (string.includes('horse')){ //check if the string includes Horse
    // Checks for Horse here because the vanilla game includes a few eye texture sets for horse eyes that would have otherwise ended up running through the patcher.
    return "Horse"; //the patcher won't actually do anything with the Horse textures, but it needs to return some kind of value.
  } else { // Only strings related to eye textures should be being passed to this function, so if it didn't contain any of the above it must be for AllRacesMinusBeast
    return "AllRacesMinusBeast";//AllRacesMinusBeast is what the game calls Human and Elven races collectively
    //IMPORTANT NOTE -
    // If an eye mod being patched did not include the full words for Khajiit or Argonian somewhere in the ID of beast race texture set records or in the folder path to the diffuse textures
    //then this part of the function will end up passing Beast Race eyes to the AllRacesMinusBeast compiler and you'll end up with unusable eyes in human/elf sliders.
    // To prevent this, make sure the eye mods you're running this patcher against have used the full words spelled out somewhere in the name of the record, the filepath, or the name of the texture itself.
    // A caveat to this; I've made a handful of checks to allow for a couple of mods that don't do this properly. Notably Runic Eyes by inoova886 and FabuLook Eyes by tzarbaby000
  } //end if/else statements
}; //end race identifier function

// This will get passed a texture set, and will return a boolean based on filtering to see if the texture set is intended for Human/Elven eyes
let shouldMakeHeadPartAllRacesMinusBeast = function(txst) {
  // Determine if the texture set is an Eye set for AllRacesMinusBeast
  // Check the filepath and filename of the associated Diffuse Texture to see if it contains the word "Eye"
  if (xelib.HasElement(txst, 'Textures (RGB/A)\\TX00 - Difuse')){ //Check if it even has a Diffuse Texture
    if (xelib.GetValue(txst, 'Textures (RGB/A)\\TX00 - Difuse').includes('Eye')||xelib.GetValue(txst, 'Textures (RGB/A)\\TX00 - Difuse').includes('eye')){ //Check if it's for Eyes first
      if (raceIdentificationParser(xelib.GetValue(txst, 'Textures (RGB/A)\\TX00 - Difuse')).includes('AllRacesMinusBeast')){ //Check the path and name for Race identifiers and make sure it's not for Beasts/horses
        return true;//if it reaches this point, it's an eye for AllRacesMinusBeast. Return true
      }//end if statement that checks for "AllRacesMinusBeast"
    }//end if statement that checks for "Eye"
  }//end if statement that checks for TX00 value

  // In most cases the Diffuse Texture filename and/or path should have indicated if it's an Eye set. If it reaches here, it failed the first test.
  // Check the name (EDID) of the Texture Set to see if it contains "Eye", just in case.
  if (xelib.LongName(txst).includes('Eye')||xelib.LongName(txst).includes('eye')) { //if it contains "Eye" it must be an eye set
    if (raceIdentificationParser(xelib.LongName(txst)).includes("AllRacesMinusBeast")) { //Check the name for Race identifiers and make sure it's not for Beast races nor Horses.
        return true;//if it reaches this point, it's an eye for AllRacesMinusBeast. Return true
    } //end if statement that checks for "AllRacesMinusBeast"
  } //end if statement that checks for "Eye"
}; //end boolean filtering function

// This will get passed a texture set, and will return a boolean based on filtering to see if the texture set is intended for Beast Race eyes
let shouldMakeHeadPartBeast = function(txst) {
  // Determine if the texture set is an Eye set for Beast Races
  // Check the filepath and filename of the associated Diffuse Texture to see if it contains the word "Eye"
  if (xelib.HasElement(txst, 'Textures (RGB/A)\\TX00 - Difuse')){ //Check if it even has a Diffuse Texture
    if (xelib.GetValue(txst, 'Textures (RGB/A)\\TX00 - Difuse').includes('Eye')||xelib.GetValue(txst, 'Textures (RGB/A)\\TX00 - Difuse').includes('eye')){ //Check if it's for Eyes first
      if (raceIdentificationParser(xelib.GetValue(txst, 'Textures (RGB/A)\\TX00 - Difuse')).includes('BeastRace')) { //Check the path and name for Race identifiers and make sure it's for Beast Races
        return true;//if it reaches this point, it's an eye for Beasts. Return true
      }//end if statement that checks for "BeastRace"
    }//end if statement that checks for "Eye"
  }//end if statement that checks for TX00 value

  // In most cases the Diffuse Texture filename and/or path should have indicated if it's an Eye set. If it reaches here, it failed the first test.
  // Check the name (EDID) of the Texture Set to see if it contains "Eye", just in case.
  if (xelib.LongName(txst).includes('Eye')||xelib.LongName(txst).includes('eye')) { //if it contains "Eye" it must be an eye set
    if (raceIdentificationParser(xelib.LongName(txst)).includes('BeastRace')) { //Check for Beast Race identifiers
        return true;//if it reaches this point, it's an eye for Beasts. Return true
    } //end if statement that checks for "BeastRace"
  } //end if statement that checks for "Eye"
}; //end boolean filtering function

//This function will copy relevant information from the original TXST to a new one so that the original eye mod .esps aren't Masters to this patch .esp
let generateTXST = function(txst, copiedTXSTRecord, helpers){
  //Identify values in the source TXST and create a new TXST record that copies its values
  let newTXSTname = "_NK_" + xelib.Name(txst); //add my tag to the start of the name to eliminate name duplication
  helpers.cacheRecord(copiedTXSTRecord, newTXSTname); //call the helper function to cache the new record's name. This should help keep the ID the same between re-builds of the patch
  xelib.AddElementValue(copiedTXSTRecord, 'EDID', newTXSTname); //Assigns the EDID - Editor ID element of the TXST record to the new name
  xelib.AddElementValue(copiedTXSTRecord, 'Textures (RGB/A)\\TX00 - Difuse', xelib.GetValue(txst, 'Textures (RGB/A)\\TX00 - Difuse')); //Assigns the TX00 - Diffuse element of the TXST to the record based on the texture of the source TXST. This is typically the actual modded texture
  xelib.AddElementValue(copiedTXSTRecord, 'Textures (RGB/A)\\TX01 - Normal/Gloss', xelib.GetValue(txst, 'Textures (RGB/A)\\TX01 - Normal/Gloss')); //Assigns the TX01 - Normal/Gloss element of the TXST to the record based on the texture of the source TXST.
  xelib.AddElementValue(copiedTXSTRecord, 'Textures (RGB/A)\\TX02 - Environment Mask/Subsurface Tint', xelib.GetValue(txst, 'Textures (RGB/A)\\TX02 - Environment Mask/Subsurface Tint')); //Assigns the TX01 - Environment Mask/Subsurface Tint element of the TXST to the record based on the texture of the source TXST.
  xelib.AddElementValue(copiedTXSTRecord, 'Textures (RGB/A)\\TX05 - Environment', xelib.GetValue(txst, 'Textures (RGB/A)\\TX05 - Environment')); //Assigns the TX05 - Environment element of the TXST to the record based on the texture of the source TXST.
  //Check if there's a TX03 value because it's usually blank
  if (xelib.HasElement(txst, 'Textures (RGB/A)\\TX03 - Glow/Detail Map')){
    //If it has one, copy it
    xelib.AddElementValue(copiedTXSTRecord, 'Textures (RGB/A)\\TX03 - Glow/Detail Map', xelib.GetValue(txst, 'Textures (RGB/A)\\TX03 - Glow/Detail Map')); //Assigns the TX03 - Glow/Detail Map element of the TXST to the record based on the texture of the source TXST.
  }//end if statement that checks for TX03
  //Check if there's a TX04 value because it's usually blank
  if (xelib.HasElement(txst, 'Textures (RGB/A)\\TX04 - Height')){
    //If it has one, copy it
    xelib.AddElementValue(copiedTXSTRecord, 'Textures (RGB/A)\\TX04 - Height', xelib.GetValue(txst, 'Textures (RGB/A)\\TX04 - Height')); //Assigns the TX04 - Height element of the TXST to the record based on the texture of the source TXST.
  }//end if statement that checks for TX04
  //Check if there's a TX06 value because it's usually blank
  if (xelib.HasElement(txst, 'Textures (RGB/A)\\TX06 - Multilayer')){
    //If it has one, copy it
    xelib.AddElementValue(copiedTXSTRecord, 'Textures (RGB/A)\\TX06 - Multilayer', xelib.GetValue(txst, 'Textures (RGB/A)\\TX06 - Multilayer')); //Assigns the TX06 - Multilayer element of the TXST to the record based on the texture of the source TXST.
  }//end if statement that checks for TX06
  //Check if there's a TX07 value because it's usually blank
  if (xelib.HasElement(txst, 'Textures (RGB/A)\\TX07 - Backlight Mask/Specular')){
    //If it has one, copy it
    xelib.AddElementValue(copiedTXSTRecord, 'Textures (RGB/A)\\TX07 - Backlight Mask/Specular', xelib.GetValue(txst, 'Textures (RGB/A)\\TX07 - Backlight Mask/Specular')); //Assigns the TX07 - Backlight Mask/Specular element of the TXST to the record based on the texture of the source TXST.
  }//end if statement that checks for TX07
  //Check if there are any flags associated with the Texture Set, such as "Has Model Space Normal Map"
  if (xelib.HasElement(txst, 'DNAM - Flags')){
    //If it has one, copy it
    xelib.AddElement(copiedTXSTRecord, 'DNAM - Flags');//first, add the Flags value itself
    xelib.SetEnabledFlags(copiedTXSTRecord, 'DNAM - Flags', xelib.GetEnabledFlags(txst, 'DNAM - Flags'));//then enable the relevant flags
  } //end if statement that checks for Flags
}; //end TXST generator function

// This function takes in a Hdpt record and some various relevant info and sets the headpart values so that it appears in the new Racemenu Sliders I've created.
let generateSpecialPart = function (spclPartRecord, spclPartName, copiedTXSTRecord, orientation, race, isFemale, locals, helpers){
  //Step through the various elements of a Headpart and set them accordingly
  xelib.AddElementValue(spclPartRecord, 'TNAM', xelib.LongName(copiedTXSTRecord)); //Assigns the TNAM - Texture Set to the texture set generated previously
  xelib.AddElementValue(spclPartRecord, 'FULL', spclPartName); // sets the FULL - Name element of the head part record
  helpers.cacheRecord(spclPartRecord, spclPartName); //call the helper function to cache the new record's name. This should help keep the ID the same between re-builds of the patch
  xelib.AddElementValue(spclPartRecord, 'EDID', spclPartName); // sets the EDID - Editor ID element of the head part record

  //The Type of the record needs to be a 'fake' Type value that doesn't exist in the CK. Skyrim will still work with it anyway, and I've provided the appropriate RaceMenu files to make these show up in dedicated sliders
  //Usually Type values only contain 8 or so possible values like "EYES" or so on. I chose 30 and 31 arbitrarily - they could be any number between 10 and 127.
  if (orientation.includes("Left")){ //check if it's supposed to be a Left eye, and set it to the left eye Type value
    xelib.AddElementValue(spclPartRecord, 'PNAM', '30'); // sets the PNAM - Type element of the head part record.
  } else { //otherwise it's supposed to be a Right eye; and set it to the right eye Type value
    xelib.AddElementValue(spclPartRecord, 'PNAM', '31'); // sets the PNAM - Type element of the head part record.
  } //end if statement that checks orientation

  xelib.AddArrayItem(spclPartRecord, 'Parts', '[0]', '0'); //Adds a PARTS value
  xelib.SetValue(spclPartRecord, 'Parts\\[0]\\NAM0', '1'); // Sets the Parts Type to Tri

  xelib.AddArrayItem(spclPartRecord, 'Parts', '[1]', '0'); //Adds a PARTS value
  xelib.SetValue(spclPartRecord, 'Parts\\[1]\\NAM0', '2'); // Sets the Parts Type to Chargen Morph

  xelib.SetFlag(spclPartRecord, 'DATA', 'Playable', true); //sets the Playable flag to true

  //Assign meshes to the PARTS values based on the Race and Gender
  if (race.includes('Argonian')){ //check if it's for Argonians
      xelib.AddElementValue(spclPartRecord, 'RNAM', 'HeadPartsArgonianandVampire [FLST:000A8039]'); // sets the RNAM - Valid Races element of the head part record

      //Assigning the argonian meshes is identical on male and female since they use the same meshes
      if (orientation.includes('Left')){ //check if it's for Left eyes
        xelib.AddElementValue(spclPartRecord, 'Model\\MODL', argLeftEyeNIFPath); // adds the left eye .nif to the MODL value
        xelib.SetValue(spclPartRecord, 'Parts\\[0]\\NAM1', argLeftEyeTRIPath); //assigns the .tri file to the PARTS value
        xelib.SetValue(spclPartRecord, 'Parts\\[1]\\NAM1', argLeftEyeCHARGENPath); //assigns the chargen .tri file to the PARTS value
      } else { //otherwise it's for Right eyes
        xelib.AddElementValue(spclPartRecord, 'Model\\MODL', argRightEyeNIFPath); // adds the right eye .nif to the MODL value
        xelib.SetValue(spclPartRecord, 'Parts\\[0]\\NAM1', argRightEyeTRIPath); //assigns the .tri file to the PARTS value
        xelib.SetValue(spclPartRecord, 'Parts\\[1]\\NAM1', argRightEyeCHARGENPath); //assigns the chargen .tri file to the PARTS value
      } //end if statement that checks orientation

      if (isFemale){ //check if it's for Female characters
        xelib.SetFlag(spclPartRecord, 'DATA', 'Female', true); //sets the Female flag to true
      } else { //otherwise it's for Male characters
        xelib.SetFlag(spclPartRecord, 'DATA', 'Male', true); //sets the Male flag to true
      } //end if statement that checks gender

  } else if (race.includes('Khajiit')){ //If it's not Argonian, check if it's for Khajiit
      xelib.AddElementValue(spclPartRecord, 'RNAM', 'HeadPartsKhajiitandVampire [FLST:000A8036]'); // sets the RNAM - Valid Races element of the head part record

      //Khajiit males and females have different eye meshes. Set them accordingly
      if (isFemale){ //check if it's for Female characters
        if (orientation.includes('Left')){ //check if it's for Left eyes
          xelib.AddElementValue(spclPartRecord, 'Model\\MODL', khajFemLeftEyeNIFPath); // adds the left eye .nif to the MODL value
          xelib.SetValue(spclPartRecord, 'Parts\\[0]\\NAM1', khajFemLeftEyeTRIPath); //assigns the .tri file to the PARTS value
          xelib.SetValue(spclPartRecord, 'Parts\\[1]\\NAM1', khajFemLeftEyeCHARGENPath); //assigns the chargen .tri file to the PARTS value
        } else { //otherwise it's for right eyes
          xelib.AddElementValue(spclPartRecord, 'Model\\MODL', khajFemRightEyeNIFPath); // adds the right eye .nif to the MODL value
          xelib.SetValue(spclPartRecord, 'Parts\\[0]\\NAM1', khajFemRightEyeTRIPath); //assigns the .tri file to the PARTS value
          xelib.SetValue(spclPartRecord, 'Parts\\[1]\\NAM1', khajFemRightEyeCHARGENPath); //assigns the chargen .tri file to the PARTS value
        } //end if statement that checks orientation
        xelib.SetFlag(spclPartRecord, 'DATA', 'Female', true); //sets the Female flag to true
      } else { // otherwise it's for Male characters
        if (orientation.includes('Left')){ //check if it's for Left eyes
          xelib.AddElementValue(spclPartRecord, 'Model\\MODL', khajMaleLeftEyeNIFPath); // adds the left eye .nif to the MODL value
          xelib.SetValue(spclPartRecord, 'Parts\\[0]\\NAM1', khajMaleLeftEyeTRIPath); //assigns the .tri file to the PARTS value
          xelib.SetValue(spclPartRecord, 'Parts\\[1]\\NAM1', khajMaleLeftEyeCHARGENPath); //assigns the chargen .tri file to the PARTS value
        } else { //otherwise it's for Right eyes
          xelib.AddElementValue(spclPartRecord, 'Model\\MODL', khajMaleRightEyeNIFPath); // adds the right eye .nif to the MODL value
          xelib.SetValue(spclPartRecord, 'Parts\\[0]\\NAM1', khajMaleRightEyeTRIPath); //assigns the .tri file to the PARTS value
          xelib.SetValue(spclPartRecord, 'Parts\\[1]\\NAM1', khajMaleRightEyeCHARGENPath); //assigns the chargen .tri file to the PARTS value
        } //end if statement that checks orientation
        xelib.SetFlag(spclPartRecord, 'DATA', 'Male', true); //sets the Male flag to true
      } //end if statement that checks gender

  } else if (race.includes('AllRacesMinusBeast')){ //if it's not Argonian or Khajiit, check if it's for AllRacesMinusBeast
      xelib.AddElementValue(spclPartRecord, 'RNAM', 'HeadPartsAllRacesMinusBeast [FLST:000A803F]'); // sets the RNAM - Valid Races element of the head part record

      //AllRacesMinusBeast male and female characters use different meshes. Set them accordingly
      if (isFemale){ //check if it's for Females
        if (orientation.includes('Left')){ //check if it's for Left eyes
          xelib.AddElementValue(spclPartRecord, 'Model\\MODL', armbFemLeftEyeNIFPath); // adds the left eye .nif to the MODL value
          xelib.SetValue(spclPartRecord, 'Parts\\[0]\\NAM1', armbFemLeftEyeTRIPath); //assigns the .tri file to the PARTS value
          xelib.SetValue(spclPartRecord, 'Parts\\[1]\\NAM1', armbFemLeftEyeCHARGENPath); //assigns the chargen .tri file to the PARTS value
        } else { //otherwise it's for Right eyes
          xelib.AddElementValue(spclPartRecord, 'Model\\MODL', armbFemRightEyeNIFPath); // adds the right eye .nif to the MODL value
          xelib.SetValue(spclPartRecord, 'Parts\\[0]\\NAM1', armbFemRightEyeTRIPath); //assigns the .tri file to the PARTS value
          xelib.SetValue(spclPartRecord, 'Parts\\[1]\\NAM1', armbFemRightEyeCHARGENPath); //assigns the chargen .tri file to the PARTS value
        } //end if statement that checks orientation
        xelib.SetFlag(spclPartRecord, 'DATA', 'Female', true); //sets the Female flag to true
      } else { //otherwise it's for Male characters
        if (orientation.includes('Left')){ //check if it's for Left eyes
          xelib.AddElementValue(spclPartRecord, 'Model\\MODL', armbMaleLeftEyeNIFPath); // adds the left eye .nif to the MODL value
          xelib.SetValue(spclPartRecord, 'Parts\\[0]\\NAM1', armbMaleLeftEyeTRIPath); //assigns the .tri file to the PARTS value
          xelib.SetValue(spclPartRecord, 'Parts\\[1]\\NAM1', armbMaleLeftEyeCHARGENPath); //assigns the chargen .tri file to the PARTS value
        } else { //otherwise it's for Right eyes
          xelib.AddElementValue(spclPartRecord, 'Model\\MODL', armbMaleRightEyeNIFPath); // adds the right eye .nif to the MODL value
          xelib.SetValue(spclPartRecord, 'Parts\\[0]\\NAM1', armbMaleRightEyeTRIPath); //assigns the .tri file to the PARTS value
          xelib.SetValue(spclPartRecord, 'Parts\\[1]\\NAM1', armbMaleRightEyeCHARGENPath); //assigns the chargen .tri file to the PARTS value
        } //end if statement that checks orientation
        xelib.SetFlag(spclPartRecord, 'DATA', 'Male', true); //sets the Male flag to true
      } //end if statement that checks gender
  } //end if/else statements that check race
  locals.numActualEyesMade +=1; //Increment the number of eye records made for reporting at the end of the patcher
}; //end special eye part generator function

// This function takes in a Hdpt record and a race string to make a set of empty eyes so the game has something to stick in the default slider that doesn't interfere with my sliders.
let generateBlankPart = function(blankRecord, race, helpers){
  let blankPartName = "_NK_BlankEyes_" + race; //give it a name
  xelib.AddElementValue(blankRecord, 'FULL', blankPartName); // sets the FULL - Name element of the head part record
  helpers.cacheRecord(blankRecord, blankPartName); //call the helper function to cache the new record's name. This should help keep the ID the same between re-builds of the patch
  xelib.AddElementValue(blankRecord, 'EDID', blankPartName); // sets the EDID - Editor ID element of the head part record
  xelib.AddElementValue(blankRecord, 'PNAM', 'Eyes'); // sets the PNAM - Type element of the head part record.
  xelib.AddArrayItem(blankRecord, 'Parts', '[0]', '0'); //Adds a PARTS value
  xelib.SetValue(blankRecord, 'Parts\\[0]\\NAM0', '2'); // Sets the Parts Type to Chargen Morph
  xelib.SetValue(blankRecord, 'Parts\\[0]\\NAM1', 'actors\\character\\character assets\\FaceParts\\eyesargonianrightchargen.tri'); //assigns the chargen .tri file to the PARTS value. Using argonian mesh here because it doesn't matter, it just needs to exist.
  xelib.SetFlag(blankRecord, 'DATA', 'Playable', true); //sets the Playable flag to true
  if (race.includes("Argonian")){ //check if it's for Argonians
    xelib.AddElementValue(blankRecord, 'RNAM', 'HeadPartsArgonianandVampire [FLST:000A8039]'); // sets the RNAM - Valid Races element of the head part record
  } else if (race.includes("Khajiit")){ //if it's not Argonian, check if it's for Khajiit
    xelib.AddElementValue(blankRecord, 'RNAM', 'HeadPartsKhajiitandVampire [FLST:000A8036]'); // sets the RNAM - Valid Races element of the head part record
  } else { //if it's not Argonian or Khajiit, it must be AllRacesMinusBeast
    xelib.AddElementValue(blankRecord, 'RNAM', 'HeadPartsAllRacesMinusBeast [FLST:000A803F]'); // sets the RNAM - Valid Races element of the head part record
  } //end if statement tha checks race
}; //end Blank Eye Color Slider record generation function

// This function takes in a special Hdpt record and a race string to make a set of empty eyes so Racemenu has a 0-value record in the slider. Largely unnecessary, but handy for testing and can be used for RP'ing a 1-eyed character I guess
let generateSpecialBlankPart = function(blankRecord, race, orientation, helpers){
  let blankPartName = "_NK_BlankEyesSpecial_" + orientation + "_" + race; //give it a name
  xelib.AddElementValue(blankRecord, 'FULL', blankPartName); // sets the FULL - Name element of the head part record
  helpers.cacheRecord(blankRecord, blankPartName); //call the helper function to cache the new record's name. This should help keep the ID the same between re-builds of the patch
  xelib.AddElementValue(blankRecord, 'EDID', blankPartName); // sets the EDID - Editor ID element of the head part record
  //As mentioned before, Racemenu allows me to use TYPE values that are out-of-range, and then handles making a slider for them through some .ini files
  if (orientation.includes("Left")){ //check if it's for Left eyes and set it to the correct Type value
    xelib.AddElementValue(blankRecord, 'PNAM', '30'); // sets the PNAM - Type element of the head part record. These are the out-of-range values same as before
  } else { //otherwise it's for Right eyes; set it to the correct Type value
    xelib.AddElementValue(blankRecord, 'PNAM', '31'); // sets the PNAM - Type element of the head part record. These are the out-of-range values same as before
  } //end if statement that checks orientation
  xelib.SetFlag(blankRecord, 'DATA', 'Playable', true); //sets the Playable flag to true
  xelib.SetFlag(blankRecord, 'DATA', 'Male', true); //sets the Male flag to true
  xelib.SetFlag(blankRecord, 'DATA', 'Female', true); //sets the Female flag to true as well, since the blank record is unisex
  if (race.includes("Argonian")){ //check if it's for Argonians
    xelib.AddElementValue(blankRecord, 'RNAM', 'HeadPartsArgonianandVampire [FLST:000A8039]'); // sets the RNAM - Valid Races element of the head part record
  } else if (race.includes("Khajiit")){ //if it's not Argonian, check if it's for Khajiit
    xelib.AddElementValue(blankRecord, 'RNAM', 'HeadPartsKhajiitandVampire [FLST:000A8036]'); // sets the RNAM - Valid Races element of the head part record
  } else { //if it's not Argonian or Kahjiit, it must be AllRacesMinusBeast
    xelib.AddElementValue(blankRecord, 'RNAM', 'HeadPartsAllRacesMinusBeast [FLST:000A803F]'); // sets the RNAM - Valid Races element of the head part record
  } //end if statement that checks race
}; //end Special Blank Part generation function

// ~~~ End Functions ~~~

// ~~~ Begin actual Patcher code ~~~

// This is the main Patching process
registerPatcher({

  // ~~Function unknown - do not change.
  info: info, //zEdit documentation doesn't mention what this is for.

  // Array of values dictates the supported games for the patcher.
  // see docs://Development/APIs/xelib/Setup for a list of game modes
  gameModes: [xelib.gmTES5, xelib.gmSSE], //Enable LE and SE versions of Skyrim
  // NOTE: I don't know how well this will actually work with LE. Racemenu hasn't been updated for LE in a long time and likely won't support my sliders

  // This is where to indicate Patcher settings.
  settings: {

    // The label is what gets displayed as the settings tab's label
    label: 'HeterochromiaRebornPatcher',

    // If you set hide to true the settings tab will not be displayed (just uncomment the next line)
    //hide: true,

    // Set the URL path for the settings template. This is the Partials folder subdir.
    templateUrl: `${patcherUrl}/partials/settings.html`,
    // Configures default settings for the patcher.
    defaultSettings: {
      //set the default setting for whether or not to disable the original Vanilla Eyes
      disableVanilla: true, //Default is True because I want to disable vanilla eyes as a rule. Setting it to false is primarily for making isolated patches (see instructions file for more)
      //set the default setting for whether or not to disable the original Modded Eyes
      disableModded: false, //Default is False because this allows the user to just disable the original mod's .esp file and save plugin room. True makes the patch file depend on the original .esp
      //set the default setting for whether or not to ignore Vanilla Texture Sets when patching
      ignoreVanillaTXSTs: false, //Defalt is false so that it processes Vanilla TXSTs. Setting to true is mostly for if you hate vanilla eye textures, or want to make isolated patches
      // Set the unique patch file for the patcher instead of using the default zPatch.esp.
      patchFileName: 'NK_Heterochromia Reborn.esp' //Reccommend leaving this as-is. If you want to make an isolated patch, just rename the file after it's been generated.
    } //end declaration of default settings
  }, //end Settings section

  // The process that actually performs the patching when the patcher is executed.
  execute: (patchFile, helpers, settings, locals) => ({

    // Perform anything that needs to be done at the beginning of the patcher's execution in this function.
    // This is where I will be creating the Special parts based on the textures available
    // Store values on locals to refer to them later in the patching process.

    // Start the execution
    initialize: function() {

      // This line loads records using the loadRecords helper function and store them on locals for the purpose of caching
      locals.headparts = helpers.loadRecords('HDPT');

      locals.numTXSTsforARMB = 0; //Declare a variable in locals to track how many TXSTs have been generated for AllRacesMinusBeast
      locals.numTXSTsforBeast = 0; //Declare a variable in locals to track how many TXSTs have been generated for Beast Races
      locals.numActualEyesMade = 0;//Declare a variable in locals to be incremented during the process to keep track of how many actual eye records are made in total

      //Create the HDPT group in which we will be creating records.
      let hdptGroup = xelib.AddElement(patchFile, 'HDPT'); // creates the HDPT group in the patch file and stores it in the 'hdptGroup' variable

      //Create the TXST group to which we will be creating records.
      let txstGroup = xelib.AddElement(patchFile, 'TXST'); // creates the TXST group in the patch file and stores it in the 'txstGroup' variable

      //Load up the texture sets using the helpers
      let textureSets = helpers.loadRecords('TXST');

      //pass each texture set through the filter declared at the top to see if it's a valid texture set for non Beast Races. If so, create the TXST and Special Headparts necessary.
      textureSets.filter(shouldMakeHeadPartAllRacesMinusBeast).forEach(txst => {

        //declare a string variable to hold the current record's FormID name so I can check where it came from
        var recordFormIDArray = (xelib.GetValue(txst, 'Record Header\\FormID')).split(":"); //Start with an array so I can split the string
        var recordFormIDNumeral = recordFormIDArray[1]; //Set it to just the Numerical value of the original ID name

        //declare a boolean to be set based on the settings
        let processTexture = false; //initializing it as false - will be turned to True if it passes the tests
        // Check the settings to see if it should ignore Vanilla textures
        if (!settings.ignoreVanillaTXSTs) { // it the setting is to process vanilla textures
          processTexture = true; //set the boolean to true
        } else { // otherwise the setting is to ignore Vanilla Textures, check the record to see if it's from Skyrim.esm or Dawnguard.esm
          if (recordFormIDNumeral.startsWith('00') || recordFormIDNumeral.startsWith('02')) { //The numeric value of the FormID should start with 00 for Skyrim.esm and 02 for Dawnguard.esm
            processTexture = false; //if it is from Vanilla, don't process it.
          } else { //otherwise it's not from Skyrim or Dawnguard, and must be from a mod
            processTexture = true; // if it's not from Vanilla, process it.
          } //end if statement that checks the source of the record
        } //end if statement that checks the Settings
        //check the boolean to see if it got changed to true
        if (processTexture) { //if so, actually process the texture

          let copiedTXSTRecord = xelib.AddElement(txstGroup, 'TXST'); //creates a TXST record in the 'txstGroup'
          generateTXST(txst, copiedTXSTRecord, helpers); //calls the function to populate the new TXST record using the values from the original

          let spclPartName = xelib.Name(txst).replace("Eyes", ""); //create a string with the texture set name and remove the word eye from it
          spclPartName = spclPartName.replace("Skin", ""); //adjust the string by removing the word skin from it, if it's there
          helpers.logMessage('Creating Special Headpart Records for ' + spclPartName); //DEBUG ENTRY. Helpful for making sure the process is actually running

          let spclPartNameFemAllRacesMinusBeastLeft = '_NK_Fem_ARMB_Left_' + spclPartName ; //create the name for the AllRacesMinusBeast Female Left eye record
          let spclPartNameFemAllRacesMinusBeastRight = '_NK_Fem_ARMB_Right_' + spclPartName ; //create the name for the AllRacesMinusBeast Female Right eye record
          let spclPartNameMaleAllRacesMinusBeastLeft = '_NK_Male_ARMB_Left_' + spclPartName ; //create the name for the AllRacesMinusBeast Male Left eye record
          let spclPartNameMaleAllRacesMinusBeastRight = '_NK_Male_ARMB_Right_' + spclPartName ; //create the name for the AllRacesMinusBeast Male Right eye record

          //Create the left female allRacesMinusBeast eye
          let spclPartRecordFemAllRacesMinusBeastLeft = xelib.AddElement(hdptGroup, 'HDPT'); // creates a head part record in the 'hdptGroup' for the AllRacesMinusBeast Female Left eye
          generateSpecialPart(spclPartRecordFemAllRacesMinusBeastLeft, spclPartNameFemAllRacesMinusBeastLeft, copiedTXSTRecord, 'Left', 'AllRacesMinusBeast', true, locals, helpers); //Populate the HDPT record with relevant data
          helpers.logMessage('Created Eye Record for ' + spclPartNameFemAllRacesMinusBeastLeft); //DEBUG ENTRY. Helpful for making sure the process is actually running
          //Create the right female allRacesMinusBeast eye
          let spclPartRecordFemAllRacesMinusBeastRight = xelib.AddElement(hdptGroup, 'HDPT'); // creates a head part record in the 'hdptGroup' for the AllRacesMinusBeast Female Right eye
          generateSpecialPart(spclPartRecordFemAllRacesMinusBeastRight, spclPartNameFemAllRacesMinusBeastRight, copiedTXSTRecord, 'Right', 'AllRacesMinusBeast', true, locals, helpers); //Populate the HDPT record with relevant data
          helpers.logMessage('Created Eye Record for ' + spclPartNameFemAllRacesMinusBeastRight); //DEBUG ENTRY. Helpful for making sure the process is actually running
          //Create the left male allRacesMinusBeast eye
          let spclPartRecordMaleAllRacesMinusBeastLeft = xelib.AddElement(hdptGroup, 'HDPT'); // creates a head part record in the 'hdptGroup' for the AllRacesMinusBeast Male Left eye
          generateSpecialPart(spclPartRecordMaleAllRacesMinusBeastLeft, spclPartNameMaleAllRacesMinusBeastLeft, copiedTXSTRecord, 'Right', 'AllRacesMinusBeast', false, locals, helpers); //Populate the HDPT record with relevant data
          helpers.logMessage('Created Eye Record for ' + spclPartNameMaleAllRacesMinusBeastLeft); //DEBUG ENTRY. Helpful for making sure the process is actually running
          //Create the right male allRacesMinusBeast eye
          let spclPartRecordMaleAllRacesMinusBeastRight = xelib.AddElement(hdptGroup, 'HDPT'); // creates a head part record in the 'hdptGroup' for the AllRacesMinusBeast Male Right eye
          generateSpecialPart(spclPartRecordMaleAllRacesMinusBeastRight, spclPartNameMaleAllRacesMinusBeastRight, copiedTXSTRecord, 'Left', 'AllRacesMinusBeast', false, locals, helpers); //Populate the HDPT record with relevant data
          helpers.logMessage('Created Eye Record for ' + spclPartNameMaleAllRacesMinusBeastRight); //DEBUG ENTRY. Helpful for making sure the process is actually running

          locals.numTXSTsforARMB +=1; //Increment the locals variable that tracks how many TXSTs have been turned into respective HDPTs.
        } //end if statement that checks if the texture is supposed to be processed
      });//End processing AllRacesMinusBeast TXSTs

      //pass each texture set through the filter declared at the top to see if it's a valid texture set for Beast Races. If so, create the TXST and Special Headparts necessary.
      textureSets.filter(shouldMakeHeadPartBeast).forEach(txst => {

        //declare a string variable to hold the current record's FormID name so I can check where it came from
        var recordFormIDArray = (xelib.GetValue(txst, 'Record Header\\FormID')).split(":"); //Start with an array so I can split the string
        var recordFormIDNumeral = recordFormIDArray[1]; //Set it to just the Numerical value of the original ID name

        //declare a boolean to be set based on the settings
        let processTexture = false; //initializing it as false - will be turned to True if it passes the tests
        // Check the settings to see if it should ignore Vanilla textures
        if (!settings.ignoreVanillaTXSTs) { // it the setting is to process vanilla textures
          processTexture = true; //set the boolean to true
        } else { // otherwise the setting is to ignore Vanilla Textures, check the record to see if it's from Skyrim.esm or Dawnguard.esm
          if (recordFormIDNumeral.startsWith('00') || recordFormIDNumeral.startsWith('02')) { //The numeric value of the FormID should start with 00 for Skyrim.esm and 02 for Dawnguard.esm
            processTexture = false; //if it is from Vanilla, don't process it.
          } else { //otherwise it's not from Skyrim or Dawnguard, and must be from a mod
            processTexture = true; // if it's not from Vanilla, process it.
          } //end if statement that checks the source of the record
        } //end if statement that checks the Settings
        //check the boolean to see if it got changed to true
        if (processTexture) { //if so, actually process the texture

          let copiedTXSTRecord = xelib.AddElement(txstGroup, 'TXST'); //creates a TXST record in the 'txstGroup'
          generateTXST(txst, copiedTXSTRecord, helpers); //calls the function to populate the new TXST record using the values from the original

          let spclPartName = xelib.Name(txst).replace("Eyes", ""); //create a string with the texture set name and remove the word eye from it
          spclPartName = spclPartName.replace("Skin", ""); //adjust the string by removing the word skin from it
          helpers.logMessage('Creating Special Headpart Records for ' + spclPartName); //DEBUG ENTRY

          let spclPartNameFemKhajiitLeft = '_NK_Fem_Khaj_Left_' + spclPartName ; //create the name for the Khajiit Female Left eye record
          let spclPartNameFemKhajiitRight = '_NK_Fem_Khaj_Right_' + spclPartName ; //create the name for the Khajiit Female Right eye record
          let spclPartNameMaleKhajiitLeft = '_NK_Male_Khaj_Left_' + spclPartName ; //create the name for the Khajiit Male Left eye record
          let spclPartNameMaleKhajiitRight = '_NK_Male_Khaj_Right_' + spclPartName ; //create the name for the Khajiit Male Right eye record
          let spclPartNameFemArgonianLeft = '_NK_Fem_Arg_Left_' + spclPartName ; //create the name for the Argonian Female Left eye record
          let spclPartNameFemArgonianRight = '_NK_Fem_Arg_Right_' + spclPartName ; //create the name for the Argonian Female Right eye record
          let spclPartNameMaleArgonianLeft = '_NK_Male_Arg_Left_' + spclPartName ; //create the name for the Argonian Male Left eye record
          let spclPartNameMaleArgonianRight = '_NK_Male_Arg_Right_' + spclPartName ; //create the name for the Argonian Male Right eye record

          // Create the Khajiit Female Left Eye
          let spclPartRecordFemKhajiitLeft = xelib.AddElement(hdptGroup, 'HDPT'); // creates a head part record in the 'hdptGroup' for the Khajiit Female Left eye
          generateSpecialPart(spclPartRecordFemKhajiitLeft, spclPartNameFemKhajiitLeft, copiedTXSTRecord, 'Left', 'Khajiit', true, locals, helpers); //Populate the HDPT record with relevant data
          helpers.logMessage('Created Eye Record for ' + spclPartNameFemKhajiitLeft);

          // Create the Khajiit Female Right Eye
          let spclPartRecordFemKhajiitRight = xelib.AddElement(hdptGroup, 'HDPT'); // creates a head part record in the 'hdptGroup' for the Khajiit Female Right eye
          generateSpecialPart(spclPartRecordFemKhajiitRight, spclPartNameFemKhajiitRight, copiedTXSTRecord, 'Right', 'Khajiit', true, locals, helpers); //Populate the HDPT record with relevant data
          helpers.logMessage('Created Eye Record for ' + spclPartNameFemKhajiitRight);

          // Create the Argonian Female Left Eye
          let spclPartRecordFemArgonianLeft = xelib.AddElement(hdptGroup, 'HDPT'); // creates a head part record in the 'hdptGroup' for the Argonian Female Left eye
          generateSpecialPart(spclPartRecordFemArgonianLeft, spclPartNameFemArgonianLeft, copiedTXSTRecord, 'Left', 'Argonian', true, locals, helpers); //Populate the HDPT record with relevant data
          helpers.logMessage('Created Eye Record for ' + spclPartNameFemArgonianLeft);

          // Create the Argonian Female Right Eye
          let spclPartRecordFemArgonianRight = xelib.AddElement(hdptGroup, 'HDPT'); // creates a head part record in the 'hdptGroup' for the Argonian Female Right eye
          generateSpecialPart(spclPartRecordFemArgonianRight, spclPartNameFemArgonianRight, copiedTXSTRecord, 'Right', 'Argonian', true, locals, helpers); //Populate the HDPT record with relevant data
          helpers.logMessage('Created Eye Record for ' + spclPartNameFemArgonianRight);

          // Create the Khajiit Male Left Eye
          let spclPartRecordMaleKhajiitLeft = xelib.AddElement(hdptGroup, 'HDPT'); // creates a head part record in the 'hdptGroup' for the Khajiit Male Left eye
          generateSpecialPart(spclPartRecordMaleKhajiitLeft, spclPartNameMaleKhajiitLeft, copiedTXSTRecord, 'Left', 'Khajiit', false, locals, helpers); //Populate the HDPT record with relevant data
          helpers.logMessage('Created Eye Record for ' + spclPartNameMaleKhajiitLeft);

          // Create the Khajiit Male Right Eye
          let spclPartRecordMaleKhajiitRight = xelib.AddElement(hdptGroup, 'HDPT'); // creates a head part record in the 'hdptGroup' for the Khajiit Male Right eye
          generateSpecialPart(spclPartRecordMaleKhajiitRight, spclPartNameMaleKhajiitRight, copiedTXSTRecord, 'Right', 'Khajiit', false, locals, helpers); //Populate the HDPT record with relevant data
          helpers.logMessage('Created Eye Record for ' + spclPartNameMaleKhajiitRight);

          // Create the Argonian Male Left Eye
          let spclPartRecordMaleArgonianLeft = xelib.AddElement(hdptGroup, 'HDPT'); // creates a head part record in the 'hdptGroup' for the Argonian Male Left eye
          generateSpecialPart(spclPartRecordMaleArgonianLeft, spclPartNameMaleArgonianLeft, copiedTXSTRecord, 'Left', 'Argonian', false, locals, helpers); //Populate the HDPT record with relevant data
          helpers.logMessage('Created Eye Record for ' + spclPartNameMaleArgonianLeft);

          // Create the Argonian Male Right Eye
          let spclPartRecordMaleArgonianRight = xelib.AddElement(hdptGroup, 'HDPT'); // creates a head part record in the 'hdptGroup' for the Argonian Male Right eye
          generateSpecialPart(spclPartRecordMaleArgonianRight, spclPartNameMaleArgonianRight, copiedTXSTRecord, 'Right', 'Argonian', false, locals, helpers); //Populate the HDPT record with relevant data
          helpers.logMessage('Created Eye Record for ' + spclPartNameMaleArgonianRight);

          locals.numTXSTsforBeast +=1; //Increment the locals variable that tracks how many TXSTs have been turned into respective HDPTs.
        } //end if statement that checks if the texture should be processed
      });//End processing Beast TXSTs

      // logging to see how many TXST records have been processed. In essence, this represents how long the Left and Right sliders will be in-game.
      helpers.logMessage(`Total Eye Texture Sets processed:\n   Humans and Elves - ${locals.numTXSTsforARMB}\n   Beast Races - ${locals.numTXSTsforBeast}\n`);

      //Report total number of new records generated
      //should be something to the effect of 4*numTXSTsforARMB + 8*numTXSTsforBeast because each TXST becomes records for each of Left/Right and Male/Female for ARMB, Argonians, and Khajiit
      helpers.logMessage("Successfully completed Record Generation for All Races and Genders. Total records generated: " + locals.numActualEyesMade);

      //Calculate and report total eye combinations possible, just for funsies
      var armbCombos = (locals.numTXSTsforARMB) ** 2; //Square the number of TXSTs
      var beastCombos = (locals.numTXSTsforBeast) ** 2; //Square the number of TXSTs
      helpers.logMessage(`Total possible eye combinations now available:\n   Humans and Elves - ` + armbCombos + `\n   Beast Races - ` + beastCombos + `\n`); //Log the numbers

      //Call the function to generate the actual "Eye Sets" to hold a blank space in the vanilla Eye Color slider for each race/gender
      let argBlankRecord = xelib.AddElement(hdptGroup, 'HDPT'); //creates a head part record in the 'hdptGroup'
      generateBlankPart(argBlankRecord, "Argonian", helpers); //send the new record to get turned into a Blank Eyes Hdpt

      let khajBlankRecord = xelib.AddElement(hdptGroup, 'HDPT'); //creates a head part record in the 'hdptGroup'
      generateBlankPart(khajBlankRecord, "Khajiit", helpers); //send the new record to get turned into a Blank Eyes Hdpt

      let armbBlankRecord = xelib.AddElement(hdptGroup, 'HDPT'); //creates a head part record in the 'hdptGroup'
      generateBlankPart(armbBlankRecord, "AllRacesMinusBeast", helpers); //send the new record to get turned into a Blank Eyes Hdpt


      //Call the function to generate the blank special Eyes to hold the 0 value in the new sliders for each race/gender
      let argSpecialBlankRecordLeft = xelib.AddElement(hdptGroup, 'HDPT'); //creates a head part record in the 'hdptGroup'
      generateSpecialBlankPart(argSpecialBlankRecordLeft, "Argonian", "Left", helpers); //send the new record to get turned into a Blank Eyes Hdpt
      let argSpecialBlankRecordRight = xelib.AddElement(hdptGroup, 'HDPT'); //creates a head part record in the 'hdptGroup'
      generateSpecialBlankPart(argSpecialBlankRecordRight, "Argonian", "Right", helpers); //send the new record to get turned into a Blank Eyes Hdpt

      let khajSpecialBlankRecordLeft = xelib.AddElement(hdptGroup, 'HDPT'); //creates a head part record in the 'hdptGroup'
      generateSpecialBlankPart(khajSpecialBlankRecordLeft, "Khajiit", "Left", helpers); //send the new record to get turned into a Blank Eyes Hdpt
      let khajSpecialBlankRecordRight = xelib.AddElement(hdptGroup, 'HDPT'); //creates a head part record in the 'hdptGroup'
      generateSpecialBlankPart(khajSpecialBlankRecordRight, "Khajiit", "Right", helpers); //send the new record to get turned into a Blank Eyes Hdpt

      let armbSpecialBlankRecordLeft = xelib.AddElement(hdptGroup, 'HDPT'); //creates a head part record in the 'hdptGroup'
      generateSpecialBlankPart(armbSpecialBlankRecordLeft, "AllRacesMinusBeast", "Left", helpers); //send the new record to get turned into a Blank Eyes Hdpt
      let armbSpecialBlankRecordRight = xelib.AddElement(hdptGroup, 'HDPT'); //creates a head part record in the 'hdptGroup'
      generateSpecialBlankPart(armbSpecialBlankRecordRight, "AllRacesMinusBeast", "Right", helpers); //send the new record to get turned into a Blank Eyes Hdpt


      helpers.logMessage("Blank Eye Records generated for each race"); //Log the end of processing Blank Eye records

    }, //end the initialize section of the patcher code. The patch is largely done at this point.

    // Process Blocks are supplied as an array and executed sequentially.
    process: [{

      // Loads records to be patched, which will then be passed to the Patch function.
      // This will be loading all headparts, and then filtering it down to playable eye records that aren't mine
      load: {

        //The record signature to load. See a record in Tree View/record headers for examples. HDPT is the Headpart signature.
        signature: 'HDPT',


        filter: function(record) {
          // return false to filter out (ignore) a particular record

          //declare a string variable to hold the current record's EDID name
          var recordEDID = xelib.GetValue(record, 'EDID');

          //declare a string variable to hold the current record's FormID name so I can check where it came from
          var recordFormIDArray = (xelib.GetValue(record, 'Record Header\\FormID')).split(":"); //Start with an array so I can split the string
          var recordFormIDNumeral = recordFormIDArray[1]; //Set it to just the Numerical value of the original ID name

          // Filter the list of headparts down to playable eye records

          //if it's not an Eye record, filter it out
          if (!(xelib.GetValue(record, 'PNAM') == 'Eyes')){
            return false;

          //if it's not playable, filter it out
          } else if (!(xelib.GetFlag(record, 'DATA', 'Playable'))){
            return false;

          // If it reaches here, it's a playable eye
          // Check where the eye record came from
          //First, check if it's from another mod
          } else if (!recordFormIDNumeral.startsWith('00') && !recordFormIDNumeral.startsWith('02')) { //Looking for the FormID's numeric value to start with 00 or 02 those are Skyrim .esm and Dawnguard.esm records
            //If a record reaches this point, it's a playable Eye record from another mod. Check the settings
            if (settings.disableModded) {
              return true; //Patch it out. This will make the original mod's .esp file a master to this plugin
            } else {
              return false; //Don't patch it. The original eye mod's .esp should just be removed from the load order to remove the eyes from the Color slider.
            } //end if statement that checks the settings
          // if it didn't get filtered out by this point, it's an Eye record from Skyrim or Dawnguard masterfiles.
          // Check the settings
          } else if (settings.disableVanilla) {  //If this is true, Vanilla eyes need to be disabled. Return true.
            return true;

          // if it reaches this point, it's a playable Vanilla eye, and the setting is set to false. Don't patch the record.
          } else {
            return false;
          } //end if/else statements that check the values of the eye record

        } //end Filtering section of the patcher

      }, //end Loading section of the patcher

      // Called for each record copied to the patch plugin. This is the step where values are set on the record.
      //This will be setting the playable flag to false for each of the records that were filtered in the Filter section.
      patch: function(record) {

         //Set the playable flag to false
         xelib.SetFlag(record, 'DATA', 'Playable', false);


      } //end Patch section of the patcher
    }] //end Process blocks section of the patcher
  }) //end Execute section of the patcher
}); //end Patcher process

// ~~~ End Patcher Code ~~~
// Thanks for reading! ~NK
