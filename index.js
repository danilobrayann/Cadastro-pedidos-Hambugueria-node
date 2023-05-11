// pegando meu express
const express = require('express')

// biblioteca de ID universal aleatório
const uuid = require('uuid')

// passando meu framework express
const app = express()

// configurando minha leitura JSON
app.use(express.json())

// minha porta
const port = 2000

// array onde vão vir as pessoas e os pedidos delas!
const Pedidos = []

/* Middleware para informar o Method e a Url*/
const Type = (request, response, next) => {
    const tipo = request.method
    const url = request.url
    console.log(`${tipo}``${url}`)
    next()
}


// verificar se meu ID é válido
const checkUserId = (request, response, next) => {
    const { id } = request.params
    const index = Pedidos.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ mensagem: "não encontrei o usuário" })
    }

    request.userIndex = index
    request.userId = id
    next()
}
// criar os pedidos
app.post('/pedidos', (request, response) => {
    const { order, clienteName, price } = request.body
    const updatePedidos = { id: uuid.v4(), order, clienteName, price, status: "Em preparação" }
    Pedidos.push(updatePedidos)
    return response.status(201).json(updatePedidos)
})

// todos os meus pedidos já feitos
app.get('/pedidos', (request, response) => {
    return response.json(Pedidos)
})


// atualizar meus pedidos
app.put('/pedidos/:id', checkUserId, Type, (request, response) => {
    const index = request.userIndex
    const id = request.userId
    const { order, clienteName, price, status } = request.body
    const updatePedidos = { id, order, clienteName, price, status }
    Pedidos[index] = updatePedidos
    return response.json(updatePedidos)
})

//pedido pronto
app.patch('/pedidos/:id', (request, response) => {
    const id = request.params.id; // extrai o id do pedido a partir da URL
    const { order, clienteName, price } = request.body;
    const updatePedidos = { order, clienteName, price, status: "Pronto" };
    const index = Pedidos.findIndex(pedido => pedido.id === id); // encontra o índice do pedido a partir do ID
    if (index === -1) {
        return response.status(404).json({ error: "Pedido não encontrado" }); // retorna um erro se o pedido não for encontrado
    }
    Pedidos[index] = { ...Pedidos[index], ...updatePedidos }; // atualiza o pedido com as informações novas
    return response.json(Pedidos[index]); // retorna o pedido atualizado
});


// criar os pedidos especifico
app.post('/Especifico', (request, response) => {
    const { order, clienteName, price } = request.body
    const updatePedidos = { id: uuid.v4(), order, clienteName, price, status: "Pedido Especifico" }
    Pedidos.push(updatePedidos)
    return response.status(201).json(updatePedidos)
})

// delete
app.delete('/pedidos/:id', (request, response) => {
    const id = request.params.id // Extrai o ID do pedido a ser deletado da URL
    const index = Pedidos.findIndex(pedido => pedido.id === id) // Procura o índice do pedido no array
    if (index === -1) { // Se o índice não foi encontrado, retorna um erro
        return response.status(404).json({ error: 'Pedido não encontrado' })
    }
    const deletedPedido = Pedidos.splice(index, 1)[0] // Remove o pedido do array e salva em uma variável
    return response.json(deletedPedido) // Retorna o pedido deletado em formato JSON
})

// minha porta
app.listen(port, () => {
    console.log(`✌meu servidor está na porta😂  ${port}`)
})














