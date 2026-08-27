import aj from '../lib/arcjet.js';
import { isSpoofedBot } from "@arcjet/inspect";

const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json('Too many requests, try again later');
            }
            else if (decision.reason.isBot()) {
                return res.status(403).json('Bot access denied');
            } else {
                return res.status(403).json('Access denied by security Policy');
            }
        }

        if (decision.results.some(isSpoofedBot)) {
            return res.status(403).json({ message: 'Malicious bot activity', error: "spoofed bot detected" });
        }

        next();
    } catch (error) {
        console.log('Arcjet Protection Error');
        next();
    }
}

export default arcjetProtection;