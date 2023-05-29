import * as React from "react";
import { Table, FormControl, FormGroup, Button, Checkbox, Form } from "react-bootstrap"
import { observer } from "mobx-react"

@observer
export class ReportView extends React.Component {

    constructor(props) {
        super(props);
        this.handleYearSelect = this.handleYearSelect.bind(this);
    }

    handleYearSelect(event) {
        this.props.vm.selectedYear = parseInt(event.target.value, 10);
    }

    render() {

        return (
            <div>
                <Form inline>
                    <FormGroup>
                        <FormControl componentClass="select" placeholder="select" value={this.props.vm.selectedYear || ''} onChange={this.handleYearSelect}>
                            <option key={'none'} value={''}>...</option>
                            {this.props.vm.selectableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </FormControl>
                        <FormGroup>
                        </FormGroup>
                        <span style={{width: "1em", display: "inline-block"}}></span>
                        {this.props.vm.people.map(person => {
                            const checked = this.props.vm.selectedPeople.find(x => x === person.name);
                            return (
                                <Checkbox
                                    key={person.name}
                                    inline
                                    checked={!!checked}
                                    onChange={() => this.props.vm.togglePerson(person.name)}
                                >
                                    {person.fullName}
                                </Checkbox>
                            );
                        })}
                        <span style={{width: "1em", display: "inline-block"}}></span>
                        <Button onClick={() => this.props.vm.makeCsv()}>CSV Export</Button>
                    </FormGroup>
                </Form>
                <Table responsive striped bordered>
                    <thead>
                        <tr>
                            <th className="text-center">Kategorie</th>
                            <th className="text-center">Gesamt [€]</th>
                            <th className="text-center">Pro Monat [€]</th>
                            <th className="text-center">Änderung [%]</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.vm.tableRows.map(row => (
                            <tr key={row.name}>
                                <td className="text-left">{row.categoryDisplay}</td>
                                <td className="text-right">{row.yearlyDisplay}</td>
                                <td className="text-right">{row.monthlyDisplay}</td>
                                <td className="text-right">{row.trendDisplay}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        )
    }
}