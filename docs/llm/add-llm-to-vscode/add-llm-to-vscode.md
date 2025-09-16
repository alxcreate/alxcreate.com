# Add LLM to VSCode

We will use the extension [Continue](https://continue.dev/) to add LLM to VSCode.

## Install extension from marketplace

Install extension for **VSCode** or **JetBrains** IDEs from the marketplace. For example, we will install for **VSCode**.

- [VSCode](https://marketplace.visualstudio.com/items?itemName=Continue.continue)
- [JetBrains](https://plugins.jetbrains.com/plugin/22707-continue)

![alt text](img/img00.png)

After installation, you need install server for use models. For example, we will use these:

- [Install Ollama](../install-ollama/install-ollama.md)
- [Install LM Studio](../install-lm-studio/install-lm-studio.md)

:::tip

If you use **LM Studio**, don't forget to enable server mode:

![alt text](img/img13.png)

:::

## Simple way to use LLM in VSCode

After install **Ollama** the simple way to use it is download models via plugin:

![alt text](img/img01.png)

Click **Connect**:

![alt text](img/img02.png)

Enjoy!

![alt text](img/img03.png)

After that, you can start using LLM in VSCode. That's all!

## Add another model

Open config file:

![alt text](img/img04.png)

Added models for Ollama shown here:

![alt text](img/img05.png)

For chat you can add another model:

![alt text](img/img06.png)

Use installed server:

![alt text](img/img07.png)

![alt text](img/img08.png)

You can choose direct model or use autodetect option:

![alt text](img/img09.png)

Detected models shown here:

![alt text](img/img10.png)

Example for LM Studio:

![alt text](img/img11.png)

Usage example. You can how used memory when answer is generated:

![alt text](img/img12.png)
