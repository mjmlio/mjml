export default {
  name: "mj-title",
  endingTag: true,
  handler: ({content}, globalAttributes) => {
    globalAttributes.title = content
  }
}
