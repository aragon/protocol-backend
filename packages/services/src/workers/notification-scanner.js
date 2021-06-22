import { User, UserNotification, UserNotificationType } from '@aragon/court-backend-server/build/models/objection'
import * as notificationScanners from '../models/notification-scanners'

/**
 * This worker loops over all notification scanner objects and 
 * inserts a notification DB entry for every email that should be sent
 */
export default async function (ctx) {
  const models = Object.keys(notificationScanners)
  for (const model of models) {
    await tryRunScanner(ctx, model)
  }
}

export async function tryRunScanner(ctx, model) {
  console.log("scanner started");
  const { logger, metrics } = ctx
  const scanner = notificationScanners[model]
  if (!scanner) {
    logger.error(`Notification scanner ${model} not found.`)
    return
  }
  console.log("scanner continues");
  const type = await UserNotificationType.findOrInsert({model})
  if (!shouldScanNow(type, scanner)) return
  console.log("scanner should scan");
  const notifications = await scanner.scan()
  for (const notification of notifications) {
    const { address, details } = notification
    const user = await User.findOne({address})
    console.log("user is found ", user);
    if (!await scanner.shouldNotifyUser(user)) continue
    console.log("user should get notified now");
    await UserNotification.findOrInsert({
      userId: user.id,
      userNotificationTypeId: type.id,
      details
    })
    console.log("inserting worked");
  }
  await type.$query().update({ scannedAt: new Date() })
  console.log("update happened");
  logger.success(`Notification type ${model} scanned.`)
  metrics.notificationScanned(model)
}

function shouldScanNow(type, scanner) {
  const { scannedAt } = type
  const { scanPeriod } = scanner
  return !scannedAt || scannedAt.getTime()+scanPeriod <= Date.now()
}
