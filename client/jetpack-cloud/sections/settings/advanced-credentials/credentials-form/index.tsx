/**
 * External dependencies
 */
import { useTranslate } from 'i18n-calypso';
import React, { FunctionComponent, useState, FormEventHandler } from 'react';

/**
 * Internal dependencies
 */
import { Button } from '@automattic/components';
import { FormState, FormMode, FormErrors, INITIAL_FORM_INTERACTION } from '../form';
import { getHostInfoFromId } from '../host-info';
import FormFieldset from 'components/forms/form-fieldset';
import FormInputValidation from 'components/forms/form-input-validation';
import FormLabel from 'components/forms/form-label';
import FormPasswordInput from 'components/forms/form-password-input';
import FormSelect from 'components/forms/form-select';
import FormSettingExplanation from 'components/forms/form-setting-explanation';
import FormTextArea from 'components/forms/form-textarea';
import FormTextInput from 'components/forms/form-text-input';
import Gridicon from 'components/gridicon';
import InfoPopover from 'components/info-popover';
import InlineInfo from './inline-info';
import SegmentedControl from 'components/segmented-control';

/**
 * Style dependencies
 */
import './style.scss';

interface Props {
	formErrors: FormErrors;
	formMode: FormMode;
	disabled?: boolean;
	formState: FormState;
	onFormStateChange: ( newFormState: FormState ) => void;
	onModeChange: ( fromMode: FormMode ) => void;
	host: string;
}

const ServerCredentialsForm: FunctionComponent< Props > = ( {
	children,
	disabled = false,
	formState,
	formErrors,
	formMode,
	onFormStateChange,
	onModeChange,
	host,
} ) => {
	const translate = useTranslate();
	const [ interactions, setFormInteractions ] = useState( INITIAL_FORM_INTERACTION );
	const hostInfo = getHostInfoFromId( host );

	const handleFormChange: FormEventHandler< HTMLInputElement > = ( { currentTarget } ) => {
		switch ( currentTarget.name ) {
			case 'protocol':
				onFormStateChange( { ...formState, protocol: currentTarget.value as 'ftp' | 'ssh' } );
				break;
			case 'host':
				setFormInteractions( { ...interactions, host: true } );
				onFormStateChange( { ...formState, host: currentTarget.value } );
				break;
			case 'port':
				setFormInteractions( { ...interactions, port: true } );
				onFormStateChange( {
					...formState,
					port: isNaN( parseInt( currentTarget.value ) ) ? '' : parseInt( currentTarget.value ),
				} );
				break;
			case 'user':
				setFormInteractions( { ...interactions, user: true } );
				onFormStateChange( { ...formState, user: currentTarget.value } );
				break;
			case 'pass':
				setFormInteractions( { ...interactions, pass: true } );
				onFormStateChange( { ...formState, pass: currentTarget.value } );
				break;
			case 'path':
				setFormInteractions( { ...interactions, path: true } );
				onFormStateChange( { ...formState, path: currentTarget.value } );
				break;
			case 'kpri':
				setFormInteractions( { ...interactions, kpri: true } );
				onFormStateChange( { ...formState, kpri: currentTarget.value } );
				break;
		}
	};

	const renderServerUsernameForm = () => (
		<FormFieldset className="credentials-form__username">
			<div className="credentials-form__support-info">
				<FormLabel htmlFor="server-username">{ translate( 'Server username' ) }</FormLabel>
				{ hostInfo?.inline?.user && (
					<InfoPopover>
						<InlineInfo credentialType={ formState.protocol } info={ hostInfo.inline.user } />
					</InfoPopover>
				) }
			</div>
			<FormTextInput
				name="user"
				id="server-username"
				placeholder={ translate( 'username' ) }
				value={ formState.user }
				onChange={ handleFormChange }
				disabled={ disabled }
				isError={ formErrors.user && ( interactions.user || ! formErrors.user.waitForInteraction ) }
				// Hint to LastPass not to attempt autofill
				data-lpignore="true"
			/>
			{ formErrors.user && ( interactions.user || ! formErrors.user.waitForInteraction ) && (
				<FormInputValidation isError={ true } text={ formErrors.user.message } />
			) }
		</FormFieldset>
	);

	const renderPasswordForm = () => (
		<div className="credentials-form__row credentials-form__user-pass">
			{ renderServerUsernameForm() }
			<FormFieldset className="credentials-form__password">
				<div className="credentials-form__support-info">
					<FormLabel htmlFor="server-password">{ translate( 'Server password' ) }</FormLabel>
					{ hostInfo?.inline?.pass && (
						<InfoPopover>
							<InlineInfo credentialType={ formState.protocol } info={ hostInfo.inline.pass } />
						</InfoPopover>
					) }
				</div>
				<FormPasswordInput
					name="pass"
					id="server-password"
					placeholder={ translate( 'password' ) }
					value={ formState.pass }
					onChange={ handleFormChange }
					disabled={ disabled }
					isError={
						formErrors.pass && ( interactions.pass || ! formErrors.pass.waitForInteraction )
					}
					// Hint to LastPass not to attempt autofill
					data-lpignore="true"
				/>
				{ formErrors.pass && ( interactions.pass || ! formErrors.pass.waitForInteraction ) && (
					<FormInputValidation isError={ true } text={ formErrors.pass.message } />
				) }
			</FormFieldset>
		</div>
	);

	const renderPrivateKeyForm = () => (
		<>
			{ renderServerUsernameForm() }
			<FormFieldset className="credentials-form__kpri">
				<div className="credentials-form__support-info">
					<FormLabel htmlFor="private-key">{ translate( 'Private key' ) }</FormLabel>
					{ hostInfo?.inline?.kpri && (
						<InfoPopover>
							<InlineInfo credentialType={ formState.protocol } info={ hostInfo.inline.kpri } />
						</InfoPopover>
					) }
				</div>
				<FormTextArea
					name="kpri"
					id="private-key"
					value={ formState.kpri }
					onChange={ handleFormChange }
					disabled={ disabled }
					className="credentials-form__private-key"
					isError={
						formErrors.kpri && ( interactions.kpri || ! formErrors.kpri.waitForInteraction )
					}
				/>
				<FormSettingExplanation>
					{ translate( 'Only non-encrypted private keys are supported.' ) }
				</FormSettingExplanation>
				{ formErrors.kpri && ( interactions.kpri || ! formErrors.kpri.waitForInteraction ) && (
					<FormInputValidation isError={ true } text={ formErrors.kpri.message } />
				) }
			</FormFieldset>
		</>
	);

	const getSubHeaderText = () => {
		if ( hostInfo !== null && hostInfo.inline !== undefined ) {
			return translate( 'Check the information icons for details on %(hostName)s', {
				args: {
					hostName: hostInfo?.name,
				},
			} );
		} else if ( hostInfo !== null && hostInfo.supportLink !== undefined ) {
			return translate(
				'Read through the {{a}}%(hostName)s support site{{/a}} to learn how to obtain your credentials.',
				{
					args: {
						hostName: hostInfo.name,
					},
					components: {
						a: <a target="_blank" rel="noopener noreferrer" href={ hostInfo.supportLink } />,
					},
				}
			);
		}
		return translate( 'Your hosting provider will be able to supply this information to you.' );
	};

	const renderCredentialLinks = () => {
		if ( hostInfo !== null && hostInfo.credentialLinks !== undefined ) {
			if ( 'ftp' === formState.protocol && hostInfo.credentialLinks.ftp !== undefined ) {
				return (
					<Button
						className="credentials-form__credentials-guide-link"
						href={ hostInfo.credentialLinks.ftp }
						target="_blank"
					>
						{ translate( 'Read the %(hostName)s credentials guide', {
							args: {
								hostName: hostInfo.name,
							},
						} ) }
						<Gridicon icon="external" />
					</Button>
				);
			}
			if ( 'ssh' === formState.protocol && hostInfo.credentialLinks.sftp !== undefined ) {
				return (
					<Button
						className="credentials-form__credentials-guide-link"
						href={ hostInfo.credentialLinks.sftp }
						target="_blank"
					>
						{ translate( 'Read the %(hostName)s credentials guide', {
							args: {
								hostName: hostInfo.name,
							},
						} ) }
						<Gridicon icon="external" />
					</Button>
				);
			}
		}
		return null;
	};

	return (
		<div className="credentials-form">
			<h3>{ translate( 'Provide your SSH, SFTP or FTP server credentials' ) }</h3>
			<p>{ getSubHeaderText() }</p>
			{ renderCredentialLinks() }
			<FormFieldset className="credentials-form__protocol-type">
				<div className="credentials-form__support-info">
					<FormLabel htmlFor="protocol-type">{ translate( 'Credential type' ) }</FormLabel>
					{ hostInfo?.inline?.protocol && (
						<InfoPopover>
							<InlineInfo credentialType={ formState.protocol } info={ hostInfo.inline.protocol } />
						</InfoPopover>
					) }
				</div>
				<FormSelect
					name="protocol"
					id="protocol-type"
					value={ formState.protocol }
					onChange={ handleFormChange }
					disabled={ disabled }
				>
					<option value="ssh">{ translate( 'SSH/SFTP' ) }</option>
					<option value="ftp">{ translate( 'FTP' ) }</option>
				</FormSelect>
			</FormFieldset>

			<div className="credentials-form__row">
				<FormFieldset className="credentials-form__server-address">
					<div className="credentials-form__support-info">
						<FormLabel htmlFor="host-address">{ translate( 'Server address' ) }</FormLabel>
						{ hostInfo?.inline?.host && (
							<InfoPopover>
								<InlineInfo credentialType={ formState.protocol } info={ hostInfo.inline.host } />
							</InfoPopover>
						) }
					</div>
					<FormTextInput
						name="host"
						id="host-address"
						placeholder={ translate( 'example.com' ) }
						value={ formState.host }
						onChange={ handleFormChange }
						disabled={ disabled }
						isError={
							formErrors.host && ( interactions.host || ! formErrors.host.waitForInteraction )
						}
					/>
					{ formErrors.host && ( interactions.host || ! formErrors.host.waitForInteraction ) && (
						<FormInputValidation isError={ true } text={ formErrors.host.message } />
					) }
				</FormFieldset>

				<FormFieldset className="credentials-form__port-number">
					<div className="credentials-form__support-info">
						<FormLabel htmlFor="server-port">{ translate( 'Port number' ) }</FormLabel>
						{ hostInfo?.inline?.port && (
							<InfoPopover>
								<InlineInfo credentialType={ formState.protocol } info={ hostInfo.inline.port } />
							</InfoPopover>
						) }
					</div>
					<FormTextInput
						name="port"
						id="server-port"
						placeholder="22"
						value={ formState.port }
						onChange={ handleFormChange }
						disabled={ disabled }
						isError={
							formErrors.port && ( interactions.port || ! formErrors.port.waitForInteraction )
						}
					/>
					{ formErrors.port && ( interactions.port || ! formErrors.port.waitForInteraction ) && (
						<FormInputValidation isError={ true } text={ formErrors.port.message } />
					) }
				</FormFieldset>
			</div>

			<FormFieldset className="credentials-form__path">
				<div className="credentials-form__support-info">
					<FormLabel htmlFor="wordpress-path">
						{ translate( 'WordPress installation path' ) }
					</FormLabel>
					{ hostInfo?.inline?.path && (
						<InfoPopover>
							<InlineInfo credentialType={ formState.protocol } info={ hostInfo.inline.path } />
						</InfoPopover>
					) }
				</div>
				<FormTextInput
					name="path"
					id="wordpress-path"
					placeholder="/public_html/wordpress-site/"
					value={ formState.path }
					onChange={ handleFormChange }
					disabled={ disabled }
					isError={
						formErrors.path && ( interactions.path || ! formErrors.path.waitForInteraction )
					}
				/>

				{ formErrors.path && ( interactions.path || ! formErrors.path.waitForInteraction ) && (
					<FormInputValidation isError={ true } text={ formErrors.path.message } />
				) }
			</FormFieldset>

			<div className="credentials-form__mode-control">
				<div className="credentials-form__support-info">
					<SegmentedControl>
						<SegmentedControl.Item
							selected={ formMode === FormMode.Password }
							onClick={ () => onModeChange( FormMode.Password ) }
						>
							{ translate( 'Use password' ) }
						</SegmentedControl.Item>
						<SegmentedControl.Item
							selected={ formMode === FormMode.PrivateKey }
							onClick={ () => onModeChange( FormMode.PrivateKey ) }
						>
							{ translate( 'Use private key' ) }
						</SegmentedControl.Item>
					</SegmentedControl>
					{ hostInfo?.inline?.mode && (
						<InfoPopover>
							<InlineInfo credentialType={ formState.protocol } info={ hostInfo.inline.mode } />
						</InfoPopover>
					) }
				</div>
			</div>

			{ formMode === FormMode.Password ? renderPasswordForm() : renderPrivateKeyForm() }

			<FormFieldset className="credentials-form__buttons">{ children }</FormFieldset>
		</div>
	);
};

export default ServerCredentialsForm;
