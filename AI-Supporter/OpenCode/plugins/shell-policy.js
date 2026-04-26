import { spawnSync } from "node:child_process"
import path from "node:path"
import os from "node:os"

const policyScript = path.join(
  os.homedir(),
  ".config",
  "opencode",
  "enforce-shell-policy.sh"
)

function getCommand(input) {
  return (
    input?.tool_input?.command ??
    input?.input?.command ??
    input?.args?.command ??
    input?.command ??
    input?.parameters?.command ??
    ""
  )
}

function isBashTool(input) {
  const tool =
    input?.tool ??
    input?.tool_name ??
    input?.name ??
    input?.metadata?.tool ??
    ""

  return tool === "bash" || tool === "shell" || tool === "terminal"
}

function runPolicy(command) {
  const payload = JSON.stringify({
    tool_input: { command }
  })

  const result = spawnSync(policyScript, {
    input: payload,
    encoding: "utf8",
    shell: false
  })

  if (result.error) {
    throw result.error
  }

  const stdout = result.stdout?.trim()
  if (!stdout) return null

  try {
    const parsed = JSON.parse(stdout)
    const decision = parsed?.hookSpecificOutput?.permissionDecision
    const reason = parsed?.hookSpecificOutput?.permissionDecisionReason

    if (decision === "deny") {
      return reason || "Command denied by shell policy."
    }
  } catch {
    return null
  }

  return null
}

export const ShellPolicyPlugin = async () => {
  return {
    "tool.execute.before": async (input) => {
      if (!isBashTool(input)) return

      const command = getCommand(input)
      if (!command) return

      const reason = runPolicy(command)
      if (!reason) return

      throw new Error(reason)
    }
  }
}

export default ShellPolicyPlugin