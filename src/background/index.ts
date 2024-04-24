import "@plasmohq/messaging/background"
import { startHub } from "@plasmohq/messaging/pub-sub"

console.log(`[Config.AI]: Service Worker loaded.`)
startHub()
