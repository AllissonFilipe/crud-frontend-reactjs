import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'
import If from '../shared/If'

const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de usuários: Incluir, Listar, Alterar e Excluir!'
}

const baseUrl = 'http://localhost:3333/users'
const initialState = {
    user: { name: '', email: '', password: '', confirmPassword: '', cpf: '', phone: '', birth_date: '' },
    list: []
}

export default class UserCrud extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    clear() {
        this.setState({ user: initialState.user })
    }

    save() {
        const user = this.state.user
        const method = user.id ? 'patch' : 'post'
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        axios[method](url, user)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ user: initialState.user, list })
            })
    }

    getUpdatedList(user, add = true) {
        const list = this.state.list.filter(u => u.id !== user.id)
        if(add) list.unshift(user)
        return list
    }

    updateField(event) {
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-4">
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" className="form-control"
                                name="name"
                                value={this.state.user.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="form-group">
                            <label>CPF</label>
                            <input type="text" className="form-control"
                                name="cpf"
                                value={this.state.user.cpf}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o CPF..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="form-group">
                            <label>Phone</label>
                            <input type="text" className="form-control"
                                name="phone"
                                value={this.state.user.phone}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o Telefone..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="form-group">
                            <label>Birth Date</label>
                            <input type="date" className="form-control"
                                name="birth_date"
                                value={this.state.user.birth_date}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite a Data de Aniversário..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="text" className="form-control"
                                name="email"
                                value={this.state.user.email}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o e-mail..." />
                        </div>
                    </div>

                    <If condicao={!this.state.user.id}>
                        <div className="col-12 col-md-4">
                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" className="form-control"
                                    name="password"
                                    value={this.state.user.password}
                                    onChange={e => this.updateField(e)}
                                    placeholder="Digite a senha..." />
                            </div>
                        </div>
                    </If>

                    <If condicao={!this.state.user.id}>
                        <div className="col-12 col-md-4">
                            <div className="form-group">
                                <label>Confirm Passowrd</label>
                                <input type="password" className="form-control"
                                    name="confirmPassword"
                                    value={this.state.user.confirmPassword}
                                    onChange={e => this.updateField(e)}
                                    placeholder="Confirme a Senha..." />
                            </div>
                        </div>
                    </If>
                </div>

                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.save(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    load(user) {
        this.setState({ user })
    }

    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.getUpdatedList(user, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }
    
    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}