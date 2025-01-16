const { parseValue } = require('recordUtils');
const SQL = require('sql-template-strings');
const { postMessageToSnsTopic } = require('snsUtils');

const buildBaseCwdSample = (id, record) => {
  return {
    id: id,
    cervidAge: parseValue(record.NewImage.cervidAge),
    cervidSex: parseValue(record.NewImage.cervidSex),
    cervidType: parseValue(record.NewImage.cervidType),
    contactAddress: parseValue(record.NewImage.contactAddress),
    contactCity: parseValue(record.NewImage.contactCity),
    contactEmail: parseValue(record.NewImage.contactEmail),
    contactFirstName: parseValue(record.NewImage.contactFirstName),
    contactLastName: parseValue(record.NewImage.contactLastName),
    contactMiddleInitial: parseValue(record.NewImage.contactMiddleInitial),
    contactPhone: parseValue(record.NewImage.contactPhone),
    contactState: parseValue(record.NewImage.contactState),
    contactZipCode: parseValue(record.NewImage.contactZipCode),
    cooperator: parseValue(record.NewImage.cooperator),
    countyOfHarvest: parseValue(record.NewImage.countyOfHarvest),
    countyOfSample: parseValue(record.NewImage.countyOfSample),
    created: parseValue(record.NewImage.created),
    createdByEmail: parseValue(record.NewImage.createdByEmail),
    createdByID: parseValue(record.NewImage.createdByID),
    modified: parseValue(record.NewImage.modified),
    modifiedByEmail: parseValue(record.NewImage.modifiedByEmail),
    modifiedByID: parseValue(record.NewImage.modifiedByID),
    cwdPrivateLands: parseValue(record.NewImage.cwdPrivateLands),
    cwdSampleComments: parseValue(record.NewImage.cwdSampleComments),
    cwdSampleID: parseValue(record.NewImage.cwdSampleID),
    cwdSampleRecordSeason: parseValue(record.NewImage.cwdSampleRecordSeason),
    cwdSampleStatus: parseValue(record.NewImage.cwdSampleStatus),
    dateOfCollection: parseValue(record.NewImage.dateOfCollection),
    gameCheckID: parseValue(record.NewImage.gameCheckID),
    geneticsDataCollected: parseValue(record.NewImage.geneticsDataCollected),
    hunterCID: parseValue(record.NewImage.hunterCID),
    sampleType: parseValue(record.NewImage.sampleType),
    utmEasting: parseValue(record.NewImage.utmEasting),
    utmNorthing: parseValue(record.NewImage.utmNorthing),
    utmZone: parseValue(record.NewImage.utmZone),
    letterSentDate: parseValue(record.NewImage.letterSentDate),
    meatAtProcessor: parseValue(record.NewImage.meatAtProcessor),
    meatKeptOrRelinquished: parseValue(record.NewImage.meatKeptOrRelinquished),
    meatReplacementTagRequested: parseValue(record.NewImage.meatReplacementTagRequested),
    planForDisposal: parseValue(record.NewImage.planForDisposal),
    tagIssuedDate: parseValue(record.NewImage.tagIssuedDate),
    privateStatus: parseValue(record.NewImage.privateStatus),
    dmap: parseValue(record.NewImage.dMap),
    validCervidSex: parseValue(record.NewImage.validCervidSex),
    validContactAddress: parseValue(record.NewImage.validContactAddress),
    validContactCity: parseValue(record.NewImage.validContactCity),
    validContactEmail: parseValue(record.NewImage.validContactEmail),
    validContactFirstName: parseValue(record.NewImage.validContactFirstName),
    validContactLastName: parseValue(record.NewImage.validContactLastName),
    validContactMiddleInitial: parseValue(record.NewImage.validContactMiddleInitial),
    validContactPhone: parseValue(record.NewImage.validContactPhone),
    validContactState: parseValue(record.NewImage.validContactState),
    validContactZipCode: parseValue(record.NewImage.validContactZipCode),
    validCountyOfHarvest: parseValue(record.NewImage.validCountyOfHarvest),
    validDateOfCollection: parseValue(record.NewImage.validDateOfCollection),
    validGameCheckID: parseValue(record.NewImage.validGameCheckID),
    validHunterCID: parseValue(record.NewImage.validHunterCID)
  };
};

const buildCwdSampleParams = (sample) => {
  return [
    { name: 'id', value: sample.id },
    { name: 'cervid_age', value: sample.cervidAge },
    { name: 'cervid_sex', value: sample.cervidSex },
    { name: 'cervid_type', value: sample.cervidType },
    { name: 'address', value: sample.contactAddress },
    { name: 'city', value: sample.contactCity },
    { name: 'state', value: sample.contactState },
    { name: 'zip', value: sample.contactZipCode },
    { name: 'email', value: sample.contactEmail },
    { name: 'first_name', value: sample.contactFirstName },
    { name: 'last_name', value: sample.contactLastName },
    { name: 'middle_initial', value: sample.contactMiddleInitial },
    { name: 'phone', value: sample.contactPhone },
    { name: 'cooperator', value: sample.cooperator },
    { name: 'county_of_harvest', value: sample.countyOfHarvest },
    { name: 'county_of_sample', value: sample.countyOfSample },
    { name: 'cwd_private_lands', value: sample.cwdPrivateLands },
    { name: 'comments', value: sample.cwdSampleComments },
    { name: 'cwd_sample_id', value: sample.cwdSampleID },
    { name: 'season', value: sample.cwdSampleRecordSeason },
    { name: 'status', value: sample.cwdSampleStatus },
    { name: 'date_of_collection', value: sample.dateOfCollection },
    { name: 'game_check_id', value: sample.gameCheckID },
    { name: 'genetics_data_collected', value: sample.geneticsDataCollected },
    { name: 'hunter_cid', value: sample.hunterCID },
    { name: 'sample_type', value: sample.sampleType },
    { name: 'zone', value: sample.utmZone },
    { name: 'utm_easting', value: sample.utmEasting },
    { name: 'utm_northing', value: sample.utmNorthing },
    { name: 'letter_sent_date', value: sample.letterSentDate },
    { name: 'meat_at_processor', value: sample.meatAtProcessor },
    { name: 'meat_kept_or_relinquished', value: sample.meatKeptOrRelinquished },
    { name: 'meat_replacement_tag_requested', value: sample.meatReplacementTagRequested },
    { name: 'plan_for_disposal', value: sample.planForDisposal },
    { name: 'tag_issued_date', value: sample.tagIssuedDate },
    { name: 'private_status', value: sample.privateStatus },
    { name: 'dmap', value: sample.dmap },
    { name: 'valid_cervid_sex', value: sample.validCervidSex },
    { name: 'valid_contact_address', value: sample.validContactAddress },
    { name: 'valid_contact_city', value: sample.validContactCity },
    { name: 'valid_contact_email', value: sample.validContactEmail },
    { name: 'valid_contact_first_name', value: sample.validContactFirstName },
    { name: 'valid_contact_last_name', value: sample.validContactLastName },
    { name: 'valid_contact_middle_initial', value: sample.validContactMiddleInitial },
    { name: 'valid_contact_phone', value: sample.validContactPhone },
    { name: 'valid_contact_state', value: sample.validContactState },
    { name: 'valid_contact_zip_code', value: sample.validContactZipCode },
    { name: 'valid_county_of_harvest', value: sample.validCountyOfHarvest },
    { name: 'valid_date_of_collection', value: sample.validDateOfCollection },
    { name: 'valid_game_check_id', value: sample.validGameCheckID },
    { name: 'valid_hunter_cid', value: sample.validHunterCID },
    { name: 'created_date', value: sample.created },
    { name: 'created_by_email', value: sample.createdByEmail },
    { name: 'created_by_id', value: sample.createdByID },
    { name: 'modified_date', value: sample.modified },
    { name: 'modified_by_email', value: sample.modifiedByEmail },
    { name: 'modified_by_id', value: sample.modifiedByID }];
};

const buildContactAttempts = (id, record) => {
  let res = [];
  let contactDates = parseValue(record.NewImage.contactDates);

  if (contactDates && contactDates.length > 0) {
    contactDates.forEach((contact) => {
      const parsedContact = parseValue(contact);
      res.push(
        {
          cwdSampleRecordId: id,
          contactDate: parseValue(parsedContact.contactDate),
          contacted: parseValue(parsedContact.contacted)
        }
      );
    });
  }
  return res;
};

const buildContactParams = (contact) => {
  return [
    { name: 'cwd_sample_id', value: contact.cwdSampleRecordId },
    { name: 'contact_date', value: contact.contactDate },
    { name: 'contacted', value: contact.contacted }
  ];
};

const buildLabResults = (id, record) => {
  let res = [];
  let labResults = parseValue(record.NewImage.labResults);
  if (labResults && labResults.length > 0) {
    labResults.forEach((labResult) => {
      const parsedLR = parseValue(labResult);
      res.push(
        {
          id: parseValue(parsedLR.id),
          lrAccessionNumber: parseValue(parsedLR.lrAccessionNumber),
          emailSent: parseValue(parsedLR.emailSent),
          cwdSampleID: parseValue(parsedLR.cwdSampleRecordID),
          comments: parseValue(parsedLR.lrComments),
          dateFinalized: parseValue(parsedLR.lrDateFinalized),
          dateReceived: parseValue(parsedLR.lrDateReceived),
          lymphNode: parseValue(parsedLR.lrLymphNode),
          obex: parseValue(parsedLR.lrObex),
          od: parseValue(parsedLR.lrOD),
          specimenDescription: parseValue(parsedLR.lrSpecimenDescription),
          specimenID: parseValue(parsedLR.lrSpecimenID),
          created: parseValue(parsedLR.created),
          createdByEmail: parseValue(parsedLR.createdByEmail),
          createdByID: parseValue(parsedLR.createdByID),
          modified: parseValue(parsedLR.modified),
          modifiedByEmail: parseValue(parsedLR.modifiedByEmail),
          modifiedByID: parseValue(parsedLR.modifiedByID)
        }
      );
    });
  }
  return res;
};

const buildLabResultParams = (labResult) => {
  return [
    { name: 'id', value: labResult.id },
    { name: 'lr_accession_number', value: labResult.lrAccessionNumber },
    { name: 'cwd_sample_id', value: labResult.cwdSampleID },
    { name: 'comments', value: labResult.comments },
    { name: 'date_finalized', value: labResult.dateFinalized },
    { name: 'date_received', value: labResult.dateReceived },
    { name: 'lymph_node', value: labResult.lymphNode },
    { name: 'obex', value: labResult.obex },
    { name: 'od', value: labResult.od },
    { name: 'specimen_description', value: labResult.specimenDescription },
    { name: 'specimen_id', value: labResult.specimenID },
    { name: 'email_sent', value: labResult.emailSent },
    { name: 'created_date', value: labResult.created },
    { name: 'created_by_email', value: labResult.createdByEmail },
    { name: 'created_by_id', value: labResult.createdByID },
    { name: 'modified_date', value: labResult.modified },
    { name: 'modified_by_email', value: labResult.modifiedByEmail },
    { name: 'modified_by_id', value: labResult.modifiedByID }];
};

const insertCwdSample = async (id, record, driver) => {
  const sample = buildBaseCwdSample(id, record);

  // When a sample is added in cwd, it actually needs to save multiple times (insert followed by one or two updates depending on the data).
  // in order to deal with that, we're dealing with the case where the updates are processed before the insert by ignoring a pk vio on the insert.
  // when an update IS processed first, it would have the full base record plus the lab results so this should be ok.
  let sql = SQL`
    INSERT INTO cwd.cwd_sample(id, cervid_age, cervid_sex, cervid_type, contact_address, contact_city, contact_email, contact_first_name,
      contact_last_name, contact_middle_initial, contact_phone, contact_state, contact_zip_code, cooperator, county_of_harvest, county_of_sample,
      cwd_private_lands, cwd_sample_comments, cwd_sample_id, cwd_sample_record_season, cwd_sample_status, date_of_collection, game_check_id,
      genetics_data_collected, dmap, hunter_cid, sample_type, utm_easting, utm_northing, utm_zone, letter_sent_date, meat_at_processor, 
      meat_kept_or_relinquished, meat_replacement_tag_requested, plan_for_disposal, tag_issued_date, private_status, 
      valid_cervid_sex, valid_contact_address, valid_contact_city, valid_contact_email, valid_contact_first_name, valid_contact_last_name,
      valid_contact_middle_initial, valid_contact_phone, valid_contact_state, valid_contact_zip_code, valid_county_of_harvest, valid_date_of_collection,
      valid_game_check_id, valid_hunter_cid, 
      created, created_by_email, created_by_id, 
      modified, modified_by_email, modified_by_id)
    VALUES (:id, :cervid_age, :cervid_sex, :cervid_type, :address, :city, :email, :first_name, :last_name, :middle_initial, :phone, :state, :zip,
      :cooperator, :county_of_harvest, :county_of_sample, :cwd_private_lands, :comments, :cwd_sample_id, :season, :status, :date_of_collection,
      :game_check_id, :genetics_data_collected, :dmap, :hunter_cid, :sample_type, :utm_easting, :utm_northing, :zone, :letter_sent_date,
      :meat_at_processor, :meat_kept_or_relinquished, :meat_replacement_tag_requested, :plan_for_disposal, :tag_issued_date, :private_status,
      :valid_cervid_sex, :valid_contact_address, :valid_contact_city, :valid_contact_email, :valid_contact_first_name, :valid_contact_last_name,
      :valid_contact_middle_initial, :valid_contact_phone, :valid_contact_state, :valid_contact_zip_code, :valid_county_of_harvest, :valid_date_of_collection,
      :valid_game_check_id, :valid_hunter_cid,
      :created_date, :created_by_email, :created_by_id, :modified_date, :modified_by_email, :modified_by_id) 
    ON CONFLICT(id) DO NOTHING RETURNING id`.text;

  let parameters = buildCwdSampleParams(sample);
  const result = await driver.query(sql, parameters);
  // under normal circumstances you wouldn't have either of these on a sample add but we do fire this insert routine when an older sample is edited
  // but doesn't exist in the replica db yet.  Those records might have contact attempts or lab results so we need to handle those.
  const contactAttempts = buildContactAttempts(id, record);
  const labResults = buildLabResults(id, record);
  await updateContactRecords(contactAttempts, driver);
  await updateLabResultRecords(labResults, driver);

  return result;
}

const updateContactRecords = async (contacts, driver) => {
  // insert new contact records without blocking inside the loop.
  const results = [];
  if (contacts && contacts.length > 0) {
    // delete all contact records for this sample, then add the new ones you just received.
    let delSql = SQL`DELETE FROM cwd.cwd_sample_contact WHERE cwd_sample_id = :cwd_sample_id`.text;
    let delParameters = [{ name: 'cwd_sample_id', value: contacts[0].cwdSampleRecordId }];
    await driver.query(delSql, delParameters);

    for (let contact of contacts) {
      let sql = SQL`
        INSERT INTO cwd.cwd_sample_contact(cwd_sample_id, contact_date, contacted)
        VALUES (:cwd_sample_id, :contact_date, :contacted) RETURNING cwd_sample_id`.text;

      let parameters = buildContactParams(contact);
      results.push(driver.query(sql, parameters));
    }
    const res = await Promise.all(results);
    return res;
  }

  return null;
}

const updateLabResultRecords = async (labResults, driver) => {
  // insert new contact records without blocking inside the loop.
  const results = [];
  if (labResults && labResults.length > 0) {
    // delete all contact records for this sample, then add the new ones you just received.
    let delSql = SQL`DELETE FROM cwd.lab_result_cwd_sample WHERE cwd_sample_id = :cwd_sample_id`.text;
    let delParameters = [{ name: 'cwd_sample_id', value: labResults[0].cwdSampleID }];
    await driver.query(delSql, delParameters);

    for (let labResult of labResults) {
      let sql = SQL`
        INSERT INTO cwd.lab_result_cwd_sample(id, lr_accession_number, cwd_sample_id, lr_comments, lr_date_finalized, lr_date_received, lr_lymph_node,
          lr_obex, lr_od, lr_specimen_description, lr_specimen_id, lr_email_sent, created, created_by_email, created_by_id, modified, modified_by_email, modified_by_id)
        VALUES (:id, :lr_accession_number, :cwd_sample_id, :comments, :date_finalized, :date_received, :lymph_node, :obex, :od, :specimen_description, :specimen_id, :email_sent,
          :created_date, :created_by_email, :created_by_id, :modified_date, :modified_by_email, :modified_by_id) ON CONFLICT(id) DO NOTHING RETURNING id`.text;

      let parameters = buildLabResultParams(labResult);
      results.push(driver.query(sql, parameters));
    }
    const res = await Promise.all(results);
    return res;
  }

  return null;
}

const updateBaseDatabaseRecord = async (sample, driver) => {
  let sql = SQL`
    UPDATE cwd.cwd_sample SET cervid_age = :cervid_age, cervid_sex = :cervid_sex, cervid_type = :cervid_type, contact_address = :address,
    contact_city = :city, contact_email = :email, contact_first_name = :first_name, contact_last_name = :last_name, contact_middle_initial = :middle_initial,
    contact_phone = :phone, contact_state = :state, contact_zip_code = :zip, cooperator = :cooperator, county_of_harvest = :county_of_harvest,
    county_of_sample = :county_of_sample, cwd_private_lands = :cwd_private_lands, cwd_sample_comments = :comments, cwd_sample_id = :cwd_sample_id,
    cwd_sample_record_season = :season, cwd_sample_status = :status, date_of_collection = :date_of_collection, game_check_id = :game_check_id,
    genetics_data_collected = :genetics_data_collected, dmap = :dmap, hunter_cid = :hunter_cid, sample_type = :sample_type, utm_easting = :utm_easting,
    utm_northing = :utm_northing, utm_zone = :zone, letter_sent_date = :letter_sent_date, meat_at_processor = :meat_at_processor,
    meat_kept_or_relinquished = :meat_kept_or_relinquished, meat_replacement_tag_requested = :meat_replacement_tag_requested, plan_for_disposal = :plan_for_disposal,
    tag_issued_date = :tag_issued_date, private_status = :private_status, valid_cervid_sex = :valid_cervid_sex, valid_contact_address = :valid_contact_address,
    valid_contact_city = :valid_contact_city, valid_contact_email = :valid_contact_email, valid_contact_first_name = :valid_contact_first_name,
    valid_contact_last_name = :valid_contact_last_name, valid_contact_middle_initial = :valid_contact_middle_initial, valid_contact_phone = :valid_contact_phone,
    valid_contact_state = :valid_contact_state, valid_contact_zip_code = :valid_contact_zip_code, valid_county_of_harvest = :valid_county_of_harvest,
    valid_date_of_collection = :valid_date_of_collection, valid_game_check_id = :valid_game_check_id, valid_hunter_cid = :valid_hunter_cid,
    created = :created_date, created_by_email = :created_by_email, created_by_id = :created_by_id,
    modified = :modified_date, modified_by_email = :modified_by_email, modified_by_id = :modified_by_id WHERE id = :id RETURNING id`.text;

  let parameters = buildCwdSampleParams(sample);
  const result = await driver.query(sql, parameters);
  return result;
}

const updateCwdSample = async (id, record, driver) => {
  const cwdSampleRecord = buildBaseCwdSample(id, record);
  const contactAttempts = buildContactAttempts(id, record);
  const labResults = buildLabResults(id, record);
  let recId = null;
  const snsDLQueueArn = process.env.SNS_DL_TOPIC_ARN;

  try {
    let sql = SQL`SELECT count(*) FROM cwd.cwd_sample WHERE id = :id`.text;
    let parameters = [{ name: 'id', value: id }];
    const res = await driver.query(sql, parameters);
    const count = res[0].count;
    if (count > 0) {
      // update Cooperator record;
      recId = await updateBaseDatabaseRecord(cwdSampleRecord, driver);
      // update contact records
      await updateContactRecords(contactAttempts, driver);
      // update lab result records
      await updateLabResultRecords(labResults, driver);
    } else {
      // even though we're in an update path, we want to handle the place where a record is out of sync with the database
      // if you update it in dynamo and it doesn't already exist in the replica, this logic will create it.
      recId = await insertCwdSample(id, record, driver);
    }
  } catch (err) {
    console.log('Error:', err);

    const baseSample = JSON.stringify(cwdSampleRecord);
    const sampleContacts = JSON.stringify(contactAttempts);
    const sampleLabResults = JSON.stringify(labResults);

    const messagePayload = {
      topicArn: snsDLQueueArn,
      message: baseSample + ' ' + sampleContacts + ' ' + sampleLabResults + ' ' + err,
      subject: "AGFC CWD DB Replication Error - CWD Sample"
    }
    await postMessageToSnsTopic(messagePayload);
  }

  if (!recId) {
    console.log('ERROR UPDATING CWD SAMPLE RECORD!');
    console.log('Id received:', id);
  }

  return recId;
}

const deleteCwdSample = async (id, driver) => {
  let res = null;
  const snsDLQueueArn = process.env.SNS_DL_TOPIC_ARN;

  try {
    // delete all contact records for this sample
    let delContactsSql = SQL`DELETE FROM cwd.cwd_sample_contact WHERE cwd_sample_id = :cwd_sample_id`.text;
    let delContactsParameters = [{ name: 'cwd_sample_id', value: id }];
    await driver.query(delContactsSql, delContactsParameters);

    // delete all lab result records for this sample
    let delLabResultsSql = SQL`DELETE FROM cwd.lab_result_cwd_sample WHERE cwd_sample_id = :cwd_sample_id`.text;
    let delLabResultsParameters = [{ name: 'cwd_sample_id', value: id }];
    await driver.query(delLabResultsSql, delLabResultsParameters);

    let sql = SQL`DELETE FROM cwd.cwd_sample WHERE id = :id`.text;
    let parameters = [{ name: 'id', value: id }];
    res = await driver.query(sql, parameters);
  } catch (err) {
    console.log('Error:', err);
    const messagePayload = {
      topicArn: snsDLQueueArn,
      message: 'Attempt to delete sample with Id: ' + id + ' ' + err,
      subject: "AGFC CWD DB Replication Error"
    }
    await postMessageToSnsTopic(messagePayload);
  }
  return res;
}


const handleCwdSampleRequest = async (eventName, id, record, driver) => {
  if (eventName.toUpperCase() === 'INSERT') {
    console.log('CWDSampleRecord INSERT request received');
    await insertCwdSample(id, record, driver);
  } else if (eventName.toUpperCase() === 'MODIFY') {
    console.log('CWDSampleRecord MODIFY request received');
    await updateCwdSample(id, record, driver);
  } else if (eventName.toUpperCase() === 'REMOVE') {
    console.log('CWDSampleRecord REMOVE request received');
    await deleteCwdSample(id, driver);
  }
  return 0;
}


module.exports = { handleCwdSampleRequest };